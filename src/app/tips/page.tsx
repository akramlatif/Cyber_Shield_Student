'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TipsPage() {
    const [tips, setTips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/tips?limit=20')
            .then(res => res.json())
            .then(data => {
                setTips(data.tips || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
                <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
                    &larr; Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Tips</h1>

                {loading ? (
                    <p className="text-gray-500">Loading tips...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tips.map((tip: any) => (
                            <div key={tip.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                                <span className="inline-block px-3 py-1 bg-teal-100 text-teal-800 text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
                                    {tip.category}
                                </span>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{tip.title}</h3>
                                <p className="text-gray-600">{tip.body}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
