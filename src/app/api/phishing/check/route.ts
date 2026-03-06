import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
    url: z.string().url('Please provide a valid URL'),
});

const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.pw', '.cf', '.ga', '.ml', '.gq', '.top', '.win', '.click'];
const PHISHING_KEYWORDS = ['login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm', 'banking', 'paypal', 'password'];
const TRUSTED_DOMAINS = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'github.com', 'facebook.com'];

interface PhishingResult {
    isSafe: boolean;
    riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;  // 0-100
    reasons: string[];
    url: string;
}

function analyzeUrl(rawUrl: string): PhishingResult {
    const reasons: string[] = [];
    let riskScore = 0;

    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return { isSafe: false, riskLevel: 'critical', riskScore: 100, reasons: ['Invalid URL format'], url: rawUrl };
    }

    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const fullUrl = rawUrl.toLowerCase();

    // ---- Positive signals ----
    // Check if it's a well-known trusted domain
    const isTrusted = TRUSTED_DOMAINS.some(d => host === d || host.endsWith('.' + d));

    // ---- Risk factors ----

    // IP address used as hostname
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
        riskScore += 35;
        reasons.push('IP address used instead of domain name');
    }

    // Not HTTPS
    if (parsed.protocol !== 'https:') {
        riskScore += 20;
        reasons.push('Connection is not encrypted (HTTP instead of HTTPS)');
    }

    // Suspicious TLD
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => host.endsWith(tld));
    if (hasSuspiciousTld) {
        riskScore += 25;
        reasons.push('Suspicious top-level domain detected');
    }

    // Excessive subdomains (> 3)
    const subdomainCount = host.split('.').length - 2;
    if (subdomainCount > 3) {
        riskScore += 15;
        reasons.push(`Excessive subdomains (${subdomainCount}) — common in spoofed URLs`);
    }

    // Phishing keywords in path
    const matchedKeywords = PHISHING_KEYWORDS.filter(kw => path.includes(kw));
    if (matchedKeywords.length > 0) {
        riskScore += matchedKeywords.length * 10;
        reasons.push(`Suspicious keywords in URL path: ${matchedKeywords.join(', ')}`);
    }

    // @ symbol in URL (tricks browsers to ignore the part before @)
    if (fullUrl.includes('@')) {
        riskScore += 30;
        reasons.push('URL contains "@" symbol — possible credential spoofing attempt');
    }

    // Very long URL
    if (rawUrl.length > 150) {
        riskScore += 10;
        reasons.push('Unusually long URL — common obfuscation technique');
    }

    // Multiple hyphens in domain
    const domainPart = host.split('.').slice(0, -1).join('.');
    if ((domainPart.match(/-/g) || []).length >= 3) {
        riskScore += 15;
        reasons.push('Multiple hyphens in domain name (possible spoofed domain)');
    }

    // Trusted domain override
    if (isTrusted) {
        riskScore = Math.max(0, riskScore - 30);
    }

    riskScore = Math.min(100, riskScore);

    const riskLevel =
        riskScore === 0 ? 'safe'
            : riskScore <= 20 ? 'low'
                : riskScore <= 50 ? 'medium'
                    : riskScore <= 75 ? 'high'
                        : 'critical';

    const isSafe = riskScore <= 20;

    if (isSafe) reasons.push('No significant threats detected');

    return { isSafe, riskLevel, riskScore, reasons, url: rawUrl };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const result = analyzeUrl(parsed.data.url);
        return NextResponse.json(result);
    } catch (err) {
        console.error('[POST /api/phishing/check]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
