'use client';

import { useState } from 'react';
import Link from 'next/link';

const MOODS = ['CALM', 'SAD', 'TIRED', 'ALONE'];

export default function AdminPage() {
    const [text, setText] = useState('');
    const [category, setCategory] = useState(MOODS[0]);
    const [status, setStatus] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SAVING...');

        try {
            const res = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, category }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed');
            }

            setStatus('SUCCESS: QUOTE UPLOADED');
            setText('');
            // Reset status after a delay
            setTimeout(() => setStatus(''), 3000);
        } catch (err: any) {
            setStatus(`ERROR: ${err.message}`);
        }
    };

    return (
        <main className="min-h-screen bg-cyber-black text-white p-6 font-mono flex flex-col items-center">

            <div className="w-full max-w-lg space-y-8 mt-12">

                <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <h1 className="text-2xl font-bold text-cyber-yellow tracking-tighter">
                        DB_ADMIN_PANEL
                    </h1>
                    <Link href="/" className="text-xs text-gray-400 hover:text-white hover:underline">
                        ← PREVIEW
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <label className="text-xs text-cyber-blue uppercase tracking-widest">Target Mood</label>
                        <div className="grid grid-cols-4 gap-2">
                            {MOODS.map(m => (
                                <button
                                    type="button"
                                    key={m}
                                    onClick={() => setCategory(m)}
                                    className={`text-xs p-2 border ${category === m ? 'bg-cyber-blue text-black border-cyber-blue font-bold' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-xs text-cyber-blue uppercase tracking-widest">Quote Payload</label>
                            <span className={`text-xs ${text.length > 50 ? 'text-red-500' : 'text-gray-600'}`}>{text.length} / 50</span>
                        </div>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={50}
                            className="w-full bg-black/50 border border-gray-700 p-4 text-white focus:outline-none focus:border-cyber-yellow transition-colors placeholder:text-gray-800"
                            placeholder="TYPE DATA HERE..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!text || text.length > 50}
                        className="w-full bg-white/5 border border-white/20 hover:border-cyber-yellow hover:text-cyber-yellow p-4 uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        EXECUTE WRITE
                    </button>

                    {status && (
                        <div className={`text-center text-xs p-2 border ${status.includes('ERROR') ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
                            {status}
                        </div>
                    )}

                </form>

            </div>
        </main>
    );
}
