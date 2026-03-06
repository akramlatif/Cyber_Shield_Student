import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuiz extends Document {
    question: string;
    options: string[];
    correctIndex: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    explanation: string;
}

const QuizSchema = new Schema<IQuiz>({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    explanation: { type: String, default: '' },
});

const Quiz: Model<IQuiz> =
    (mongoose.models.Quiz as Model<IQuiz>) || mongoose.model<IQuiz>('Quiz', QuizSchema);

export default Quiz;
