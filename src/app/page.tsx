'use client';

import { useState } from 'react';
import Link from 'next/link';
import OledPreview from '@/components/OledPreview';

const MOODS = ['CALM', 'SAD', 'TIRED', 'ALONE'];

export default function Home() {
    const [currentMood, setCurrentMood] = useState<string | null>(null);
    const [quote, setQuote] = useState<string>('SELECT MOOD');
    const [loading, setLoading] = useState(false);

    const fetchQuote = async (mood: string) => {
        setLoading(true);
        setCurrentMood(mood);
        try {
            const res = await fetch(`/api/quote?mood=${mood}`);
            const text = await res.text();
            setQuote(text);
        } catch (err) {
            setQuote("ERR: NETWORK");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-12 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0D0D0D] to-black">

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyber-yellow to-cyber-blue drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    CONTROLLER
                </h1>
                <p className="text-cyber-gray text-xs tracking-[0.5em] uppercase">Mood Sentry v1.0</p>
            </div>

            {/* Preview Section */}
            <div className="flex flex-col items-center gap-4">
                <div className=" uppercase text-[10px] tracking-widest text-cyber-yellow/80 border border-cyber-yellow/30 px-2 py-0.5 rounded-full">
                    Device Preview
                </div>
                <OledPreview text={loading ? "LOADING..." : quote} className="scale-125 md:scale-150 transform transition-all duration-300" />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {MOODS.map((mood) => (
                    <button
                        key={mood}
                        onClick={() => fetchQuote(mood)}
                        className={`
              relative overflow-hidden group p-4 border transition-all duration-300
              ${currentMood === mood
                                ? 'border-cyber-blue bg-cyber-blue/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                                : 'border-white/10 hover:border-cyber-yellow/50 hover:bg-cyber-yellow/5'
                            }
            `}
                    >
                        {/* Corner Markers */}
                        <span className="absolute top-0 left-0 w-1 h-1 bg-current opacity-50 group-hover:bg-cyber-yellow transition-colors"></span>
                        <span className="absolute top-0 right-0 w-1 h-1 bg-current opacity-50 group-hover:bg-cyber-yellow transition-colors"></span>
                        <span className="absolute bottom-0 left-0 w-1 h-1 bg-current opacity-50 group-hover:bg-cyber-yellow transition-colors"></span>
                        <span className="absolute bottom-0 right-0 w-1 h-1 bg-current opacity-50 group-hover:bg-cyber-yellow transition-colors"></span>

                        <span className={`text-sm font-bold tracking-widest ${currentMood === mood ? 'text-cyber-blue' : 'text-gray-400 group-hover:text-cyber-yellow'}`}>
                            {mood}
                        </span>
                    </button>
                ))}
            </div>

            {/* Footer / Admin Link */}
            <div className="fixed bottom-8">
                <Link href="/admin" className="text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-white pb-0.5">
          // ACCESS ADMIN DATABASE
                </Link>
            </div>

        </main>
    );
}
