'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function PhishingPage() {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkUrl = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await fetch('/api/phishing/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
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
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Phishing Detector</h1>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Enter a URL to analyze</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="https://example.com"
                    />
                </div>

                <Button onClick={checkUrl} className="w-full py-3 mb-8">
                    {loading ? 'Analyzing...' : 'Scan Link'}
                </Button>

                {result && (
                    <div className={`border rounded p-6 ${result.isSafe ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h2 className={`text-2xl font-bold mb-2 ${result.isSafe ? 'text-green-700' : 'text-red-700'}`}>
                            Risk Level: {result.riskLevel.toUpperCase()}
                        </h2>
                        <p className="font-semibold mb-4">Risk Score: {result.riskScore}/100</p>

                        <h3 className="font-semibold text-gray-800 mb-2">Analysis Results:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {result.reasons && result.reasons.map((r: string, i: number) => (
                                <li key={i} className="text-gray-700">{r}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
