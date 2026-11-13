import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Quiz from '@/lib/models/Quiz';
import QuizAttempt from '@/lib/models/QuizAttempt';
import { verifyToken } from '@/lib/jwt';
import { AuthenticatedRequest } from '@/lib/middleware/auth';
import mongoose from 'mongoose';

const submitSchema = z.object({
    answers: z
        .array(
            z.object({
                questionId: z.string().min(1),
                selectedIndex: z.number().int().min(0),
            })
        )
        .min(1, 'At least one answer is required'),
});

/**
 * Extracts the user from the Authorization header (optional).
 * Quiz submission stays public (no login required), but when a valid token
 * is present the attempt is saved against the real user instead of a dummy ID.
 */
function getOptionalUserId(req: AuthenticatedRequest): string | null {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const payload = verifyToken(authHeader.slice(7));
        return payload.userId;
    } catch {
        return null; // Invalid/expired token: grade anyway, just don't persist
    }
}

export const POST = async (req: AuthenticatedRequest) => {
    try {
        const body = await req.json();

        const parsed = submitSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        await connectDB();

        const { answers } = parsed.data;
        const questionIds = answers.map(a => new mongoose.Types.ObjectId(a.questionId));

        // Fetch actual questions (with correct answers) from DB
        const questions = await Quiz.find({ _id: { $in: questionIds } });

        if (questions.length === 0) {
            return NextResponse.json({ error: 'No valid questions found' }, { status: 404 });
        }

        // Map for quick lookup
        const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

        let score = 0;
        const gradedAnswers = answers.map(a => {
            const question = questionMap.get(a.questionId);
            if (!question) return { questionId: a.questionId, selectedIndex: a.selectedIndex, isCorrect: false };

            const isCorrect = a.selectedIndex === question.correctIndex;
            if (isCorrect) score++;

            return {
                questionId: a.questionId,
                selectedIndex: a.selectedIndex,
                isCorrect,
                correctIndex: question.correctIndex,
                explanation: question.explanation,
            };
        });

        const total = gradedAnswers.length;
        const percentage = Math.round((score / total) * 100);

        // Persist the attempt only when we know whose attempt it is.
        // Previously every anonymous submission was saved against a dummy
        // user ID, polluting the scores table and breaking /api/quiz/scores.
        const userId = getOptionalUserId(req);
        if (userId) {
            await QuizAttempt.create({
                userId: new mongoose.Types.ObjectId(userId),
                score,
                total,
                percentage,
                answers: gradedAnswers.map(a => ({
                    questionId: a.questionId,
                    selectedIndex: a.selectedIndex,
                    isCorrect: a.isCorrect,
                })),
            });
        }

        return NextResponse.json({
            score,
            total,
            percentage,
            grade: percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F',
            answers: gradedAnswers,
            saved: !!userId,
        });
    } catch (err) {
        console.error('[POST /api/quiz/submit]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
