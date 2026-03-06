import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
    try {
        await connectDB();
        const user = await User.findById(req.user.userId).select('-passwordHash');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error('[GET /api/auth/me]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
