'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function PasswordPage() {
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkPassword = async () => {
        if (!password) return;
        setLoading(true);
        try {
            const res = await fetch('/api/password/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
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
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <Link href="/" className="text-teal-600 hover:underline mb-6 inline-block">
                    &larr; Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Password Strength Checker</h1>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Enter a password to test</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g. hunter2"
                    />
                </div>

                <Button onClick={checkPassword} className="w-full py-3 mb-8">
                    {loading ? 'Checking...' : 'Check Strength'}
                </Button>

                {result && (
                    <div className="border border-gray-200 rounded p-6 bg-gray-50">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: result.color }}>
                            Strength: {result.label} ({result.score}/4)
                        </h2>
                        <p className="text-gray-600 mb-4">Entropy: {result.entropy} bits</p>

                        {result.suggestions && result.suggestions.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Suggestions to improve:</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {result.suggestions.map((s: string, i: number) => (
                                        <li key={i} className="text-gray-700">{s}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
