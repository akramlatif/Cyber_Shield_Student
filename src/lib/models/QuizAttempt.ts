import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
}

export interface IQuizAttempt extends Document {
    userId: mongoose.Types.ObjectId;
    score: number;
    total: number;
    percentage: number;
    answers: IAnswer[];
    createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
    {
        questionId: { type: String, required: true },
        selectedIndex: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
    },
    { _id: false }
);

const QuizAttemptSchema = new Schema<IQuizAttempt>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true },
        total: { type: Number, required: true },
        percentage: { type: Number, required: true },
        answers: { type: [AnswerSchema], required: true },
    },
    { timestamps: true }
);

const QuizAttempt: Model<IQuizAttempt> =
    (mongoose.models.QuizAttempt as Model<IQuizAttempt>) ||
    mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
