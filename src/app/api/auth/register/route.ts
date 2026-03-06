import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/jwt';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        await connectDB();

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await User.create({ name, email, passwordHash });

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            plan: user.plan,
        });

        return NextResponse.json(
            {
                message: 'Account created successfully',
                token,
                user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('[POST /api/auth/register]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
