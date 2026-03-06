import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db';
import Quiz from '@/lib/models/Quiz';
import QuizAttempt from '@/lib/models/QuizAttempt';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/auth';
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

export const POST = async (req: Request) => {
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

        // Save attempt using a dummy user ID since we removed withAuth for frontend testing
        await QuizAttempt.create({
            userId: new mongoose.Types.ObjectId('000000000000000000000000'),
            score,
            total,
            percentage,
            answers: gradedAnswers.map(a => ({
                questionId: a.questionId,
                selectedIndex: a.selectedIndex,
                isCorrect: a.isCorrect,
            })),
        });

        return NextResponse.json({
            score,
            total,
            percentage,
            grade: percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F',
            answers: gradedAnswers,
        });
    } catch (err) {
        console.error('[POST /api/quiz/submit]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
