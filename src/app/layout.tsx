import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Mood Sentry',
    description: 'Cyber-aesthetic Mood Dashboard',
    manifest: '/manifest.json', // Placeholder for PWA
    themeColor: '#FCEE0A',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-cyber-black text-white min-h-screen selection:bg-cyber-yellow selection:text-cyber-black">
                {children}
            </body>
        </html>
    );
}
