import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
    password: z.string().min(1, 'Password is required'),
});

interface PasswordResult {
    score: number;        // 0-4  (0=very weak, 4=very strong)
    label: string;
    entropy: number;      // bits
    suggestions: string[];
    color: string;
}

function calcEntropy(password: string): number {
    const charsetSize =
        (/[a-z]/.test(password) ? 26 : 0) +
        (/[A-Z]/.test(password) ? 26 : 0) +
        (/[0-9]/.test(password) ? 10 : 0) +
        (/[^a-zA-Z0-9]/.test(password) ? 32 : 0);

    if (charsetSize === 0) return 0;
    return Math.round(password.length * Math.log2(charsetSize));
}

const COMMON_PATTERNS = [
    /^(123456789|password|qwerty|abc123|letmein|welcome|monkey|dragon|master|admin)/i,
    /^(.)\1+$/, // all same character
    /(012|123|234|345|456|567|678|789|890)/,
    /(abc|bcd|cde|def|efg|fgh|ghi|hij)/i,
    /(qwe|wer|ert|rty|tyu|yui|uio|iop)/i,
];

function checkPassword(password: string): PasswordResult {
    const suggestions: string[] = [];
    let score = 0;

    if (password.length >= 8) score++;
    else suggestions.push('Use at least 8 characters');

    if (password.length >= 12) score++;
    else if (password.length >= 8) suggestions.push('Use 12+ characters for stronger security');

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    else suggestions.push('Mix upper and lower case letters');

    if (/[0-9]/.test(password)) score++;
    else suggestions.push('Add numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else suggestions.push('Add special characters (!, @, #, etc.)');

    // Deductions
    for (const pattern of COMMON_PATTERNS) {
        if (pattern.test(password)) {
            score = Math.max(0, score - 2);
            suggestions.unshift('Avoid common patterns and sequences');
            break;
        }
    }

    // Clamp to 0-4
    score = Math.min(4, Math.max(0, score));

    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

    return {
        score,
        label: labels[score],
        entropy: calcEntropy(password),
        suggestions,
        color: colors[score],
    };
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

        const result = checkPassword(parsed.data.password);
        return NextResponse.json(result);
    } catch (err) {
        console.error('[POST /api/password/check]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
