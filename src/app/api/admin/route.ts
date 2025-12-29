import { NextRequest, NextResponse } from 'next/server';
import { saveQuote, Category } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, category } = body;

        if (!text || !category) {
            return NextResponse.json({ error: 'Missing text or category' }, { status: 400 });
        }

        if (!['CALM', 'SAD', 'TIRED', 'ALONE'].includes(category)) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        if (text.length > 50) {
            return NextResponse.json({ error: 'Quote too long (max 50 chars)' }, { status: 400 });
        }

        // Await the async save
        const newQuote = await saveQuote({ text, category: category as Category });
        return NextResponse.json(newQuote, { status: 201 });

    } catch (error: any) {
        console.error("API Error:", error);
        const isSqlConfigured = !!(process.env.DATABASE_URL);

        // Return detailed error message to the UI
        return NextResponse.json({
            error: `DB Error: ${error.message} (Supabase/DB Configured: ${isSqlConfigured})`,
            details: error.message,
            sql_configured: isSqlConfigured
        }, { status: 500 });
    }
}
