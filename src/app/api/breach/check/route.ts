import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const schema = z.object({
    email: z.string().email('Please provide a valid email address'),
});

interface BreachEntry {
    Name: string;
    Domain: string;
    BreachDate: string;
    Description: string;
    DataClasses: string[];
    PwnCount: number;
}

async function checkEmailBreach(email: string): Promise<BreachEntry[]> {
    const apiKey = process.env.HIBP_API_KEY;

    if (!apiKey) {
        // Return a simulated "unavailable" response when no API key is configured
        return [];
    }

    const res = await fetch(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
        {
            headers: {
                'hibp-api-key': apiKey,
                'user-agent': 'CyberShieldStudentApp',
            },
            // 10 second timeout
            signal: AbortSignal.timeout(10000),
        }
    );

    if (res.status === 404) return []; // Not found in any breach
    if (res.status === 401) throw new Error('Invalid HIBP API key');
    if (!res.ok) throw new Error(`HIBP API error: ${res.status}`);

    return res.json();
}

async function checkPasswordBreach(password: string): Promise<number> {
    // k-Anonymity: only send first 5 chars of SHA-1 hash
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: { 'Add-Padding': 'true' },
        signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error('Password breach check failed');

    const text = await res.text();
    const lines = text.split('\n');

    for (const line of lines) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix.trim() === suffix) {
            return parseInt(count.trim(), 10);
        }
    }

    return 0;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const checkType = body.type || 'email'; // 'email' or 'password'

        if (checkType === 'password' && body.password) {
            const passwordSchema = z.object({ password: z.string().min(1) });
            const parsed = passwordSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ error: 'Password is required' }, { status: 400 });
            }

            const count = await checkPasswordBreach(parsed.data.password);
            return NextResponse.json({
                type: 'password',
                breached: count > 0,
                occurrences: count,
                message:
                    count > 0
                        ? `This password has been seen ${count.toLocaleString()} times in data breaches. Change it immediately.`
                        : 'This password has not been found in known data breaches.',
            });
        }

        // Default: email check
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const breaches = await checkEmailBreach(parsed.data.email);
        const apiKeyConfigured = !!process.env.HIBP_API_KEY;

        return NextResponse.json({
            type: 'email',
            email: parsed.data.email,
            breached: breaches.length > 0,
            breachCount: breaches.length,
            breaches: breaches.map(b => ({
                name: b.Name,
                domain: b.Domain,
                date: b.BreachDate,
                description: b.Description,
                dataClasses: b.DataClasses,
                affectedAccounts: b.PwnCount,
            })),
            message: !apiKeyConfigured
                ? 'Email breach check requires an HIBP API key. Configure HIBP_API_KEY in .env.local to enable this feature.'
                : breaches.length > 0
                    ? `Your email was found in ${breaches.length} data breach(es). Review the details and change any reused passwords.`
                    : 'Great news! Your email was not found in any known data breaches.',
            apiKeyConfigured,
        });
    } catch (err) {
        console.error('[POST /api/breach/check]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
