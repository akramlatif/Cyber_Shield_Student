'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function QuizPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/quiz/questions?limit=5')
            .then(res => res.json())
            .then(data => {
                setQuestions(data.questions || []);
                setLoading(false);
            });
    }, []);

    const submitQuiz = async () => {
        setLoading(true);
        const answersPayload = Object.keys(answers).map(qId => ({
            questionId: qId,
            selectedIndex: answers[qId]
        }));

        try {
            const res = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersPayload }),
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
                <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
                    &larr; Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Quiz</h1>

                {loading && !result && <p>Loading quiz...</p>}

                {!loading && !result && questions.length > 0 && (
                    <div className="space-y-8">
                        {questions.map((q: any, i: number) => (
                            <div key={q._id} className="border border-gray-200 rounded p-6 bg-gray-50">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">{i + 1}. {q.question}</h3>
                                <div className="space-y-2">
                                    {q.options.map((opt: string, optIdx: number) => (
                                        <label key={optIdx} className="flex items-center gap-3 cursor-pointer p-3 border rounded bg-white hover:bg-teal-50">
                                            <input
                                                type="radio"
                                                name={`q-${q._id}`}
                                                value={optIdx}
                                                checked={answers[q._id] === optIdx}
                                                onChange={() => setAnswers({ ...answers, [q._id]: optIdx })}
                                                className="w-4 h-4 text-teal-600"
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <Button onClick={submitQuiz} className="w-full py-4 text-lg">
                            Submit Answers
                        </Button>
                    </div>
                )}

                {result && (
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">You scored {result.score} / {result.total}!</h2>
                        <p className="text-2xl mb-8">Grade: <strong className="text-teal-600">{result.grade}</strong> ({result.percentage}%)</p>
                        <div className="text-left space-y-6">
                            {result.answers.map((ans: any, i: number) => (
                                <div key={i} className={`p-4 border rounded ${ans.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <p className="font-bold mb-2">
                                        Question {i + 1}: {ans.isCorrect ? <span className="text-green-700">Correct!</span> : <span className="text-red-700">Incorrect</span>}
                                    </p>
                                    <p className="text-gray-700">{ans.explanation}</p>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => window.location.reload()} className="mt-8">Try Again</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
