import React from 'react';

interface OledPreviewProps {
    text: string;
    className?: string;
}

export default function OledPreview({ text, className = '' }: OledPreviewProps) {
    return (
        <div className={`relative inline-block p-1 rounded-sm bg-gray-800 border border-gray-700 shadow-2xl ${className}`}>
            {/* Physical Bezel Look */}

            {/* Screen Container 128x32 mock aspect ratio */}
            <div className="relative w-[256px] h-[64px] bg-black overflow-hidden flex flex-col pointer-events-none select-none">

                {/* Yellow Top Band (approx 1/4 of height typically on these dual color OLEDs) */}
                <div className="h-[16px] w-full text-[#FCEE0A] flex items-center justify-center overflow-hidden px-2">
                    {/* Simulate the yellow part if text falls here, or just use it as a status bar? 
               Usually strictly split. Let's assume the text flows or we use the top for a header.
               For this requested "Preview", let's just make the text standard and let the color bands apply validly.
               Actually usually 128x64 has the split. 128x32 is often monochrome white or blue. 
               User asked for "yellow top band and blue bottom band". 
               Let's try to map the top 25% to yellow and bottom to blue using a mask or just distinct colored elements.
           */}
                    {/* Scanline overlay */}
                    <div className="absolute inset-0 z-10 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAD0lEQVQHR2NkYGBg+A8AAQAFAKsWBBwAAAAASUVORK5CYII=')] opacity-20 bg-repeat bg-[length:100%_4px]"></div>

                    {/* We will render the text in a single layer but color it with a gradient/clip? 
               Easier: Just render text in white and use mix-blend-mode or simple CSS gradient text.
           */}

                </div>

                {/* Actual Content Area - Using a gradient text approach to mimic the bands */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                    <p
                        className="text-2xl font-mono leading-none tracking-widest text-center whitespace-normal break-words w-full"
                        style={{
                            fontFamily: "'Courier New', monospace",
                            background: "linear-gradient(to bottom, #FCEE0A 25%, #00F0FF 25%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))"
                        }}
                    >
                        {text || "waiting..."}
                    </p>
                </div>

                {/* Screen Glare/Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-20 pointer-events-none"></div>
            </div>
        </div>
    );
}
