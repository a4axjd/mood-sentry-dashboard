import { NextRequest, NextResponse } from 'next/server';
import { getRandomQuote, Category } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mood = searchParams.get('mood');

    if (!mood) {
        return new NextResponse('Missing mood parameter', { status: 400 });
    }

    const moodUpper = mood.toUpperCase();
    if (!['CALM', 'SAD', 'TIRED', 'ALONE'].includes(moodUpper)) {
        return new NextResponse('Invalid mood. Options: CALM, SAD, TIRED, ALONE', { status: 400 });
    }

    // Await the async function
    const quote = await getRandomQuote(moodUpper as Category);

    return new NextResponse(quote, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, max-age=0',
        },
    });
}
