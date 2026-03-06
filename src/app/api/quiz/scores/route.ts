import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QuizAttempt from '@/lib/models/QuizAttempt';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
import mongoose from 'mongoose';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
    try {
        await connectDB();

        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const attempts = await QuizAttempt.find({ userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const total = await QuizAttempt.countDocuments({ userId });
        const avgPercentage =
            attempts.length > 0
                ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
                : 0;

        const bestAttempt = attempts.length > 0
            ? attempts.reduce((best, a) => (a.percentage > best.percentage ? a : best))
            : null;

        return NextResponse.json({
            attempts: attempts.map(a => ({
                id: a._id,
                score: a.score,
                total: a.total,
                percentage: a.percentage,
                grade: a.percentage >= 90 ? 'A' : a.percentage >= 80 ? 'B' : a.percentage >= 70 ? 'C' : a.percentage >= 60 ? 'D' : 'F',
                createdAt: a.createdAt,
            })),
            stats: {
                totalAttempts: total,
                averagePercentage: avgPercentage,
                bestPercentage: bestAttempt?.percentage ?? 0,
            },
        });
    } catch (err) {
        console.error('[GET /api/quiz/scores]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
});
