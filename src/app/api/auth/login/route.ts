import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { signToken } from '@/lib/jwt';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        const token = signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            plan: user.plan,
        });

        return NextResponse.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
        });
    } catch (err) {
        console.error('[POST /api/auth/login]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
