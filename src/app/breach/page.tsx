'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function BreachPage() {
    const [inputVal, setInputVal] = useState('');
    const [type, setType] = useState('email');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const checkBreach = async () => {
        if (!inputVal) return;
        setLoading(true);
        try {
            const payload = type === 'email' ? { email: inputVal } : { type: 'password', password: inputVal };
            const res = await fetch('/api/breach/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Data Breach Alert</h1>

                <div className="flex gap-4 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="email" checked={type === 'email'} onChange={() => setType('email')} />
                        Check Email
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" value="password" checked={type === 'password'} onChange={() => setType('password')} />
                        Check Password
                    </label>
                </div>

                <div className="mb-6">
                    <input
                        type={type === 'email' ? 'email' : 'text'}
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        className="w-full border border-gray-300 rounded p-3 text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder={type === 'email' ? 'your@email.com' : 'Enter password to check'}
                    />
                </div>

                <Button onClick={checkBreach} className="w-full py-3 mb-8">
                    {loading ? 'Checking...' : 'Check for Breaches'}
                </Button>

                {result && (
                    <div className={`border rounded p-6 ${result.breached ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <h2 className={`text-xl font-bold mb-2 ${result.breached ? 'text-red-700' : 'text-green-700'}`}>
                            {result.message || (result.breached ? 'Oh no! Breaches found' : 'Good news! No breaches found')}
                        </h2>

                        {result.breaches && result.breaches.length > 0 && (
                            <div className="mt-4 space-y-4">
                                {result.breaches.map((b: any, i: number) => (
                                    <div key={i} className="bg-white p-4 rounded border border-red-100 shadow-sm">
                                        <h3 className="font-bold text-lg">{b.name} <span className="text-sm text-gray-500 font-normal">({b.date})</span></h3>
                                        <p className="text-sm text-gray-700 my-2" dangerouslySetInnerHTML={{ __html: b.description }}></p>
                                        <p className="text-xs text-gray-500"><strong>Compromised data:</strong> {b.dataClasses.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
