import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';
import Redis from 'ioredis';

const dataDirectory = path.join(process.cwd(), 'data');
const quotesFilePath = path.join(dataDirectory, 'quotes.json');

export type Category = 'CALM' | 'SAD' | 'TIRED' | 'ALONE';

export interface Quote {
    id: string;
    text: string;
    category: Category;
}

const INITIAL_QUOTES: Quote[] = [
    { id: "1", text: "Breathe in. Breathe out.", category: "CALM" },
    { id: "2", text: "This too shall pass.", category: "SAD" },
    { id: "3", text: "Rest is productive.", category: "TIRED" },
    { id: "4", text: "You are your own best company.", category: "ALONE" }
];

// Helper to check what mode we are in
function getStorageMode() {
    if (process.env.REDIS_URL) return 'REDIS';
    // Fallback for debugging - Use the provided URL if env is missing
    if (true) return 'REDIS_FALLBACK';
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) return 'VERCEL_KV';
    return 'LOCAL';
}

const FALLBACK_REDIS_URL = "redis://default:9x4w77bsxs0p2STlMRSEpRvYYfzvUSOX@redis-15756.crce179.ap-south-1-1.ec2.cloud.redislabs.com:15756";

// Internal: Get fresh quotes array
async function fetchQuotes(): Promise<Quote[]> {
    const mode = getStorageMode();
    try {
        if (mode === 'REDIS' || mode === 'REDIS_FALLBACK') {
            const url = mode === 'REDIS' ? process.env.REDIS_URL! : FALLBACK_REDIS_URL;
            const redis = new Redis(url);
            const data = await redis.get('quotes');
            redis.quit(); // Close connection to prevent leaks in serverless (though Next.js reuses usually, explicit for now)
            return data ? JSON.parse(data) : INITIAL_QUOTES;
        }

        if (mode === 'VERCEL_KV') {
            const data = await kv.get<Quote[]>('quotes');
            return data || INITIAL_QUOTES;
        }

        // Local
        if (!fs.existsSync(quotesFilePath)) return INITIAL_QUOTES;
        return JSON.parse(fs.readFileSync(quotesFilePath, 'utf8'));

    } catch (error) {
        console.error("DB Error:", error);
        return INITIAL_QUOTES;
    }
}

// Internal: Write quotes array
async function writeQuotes(quotes: Quote[]) {
    const mode = getStorageMode();
    if (mode === 'REDIS' || mode === 'REDIS_FALLBACK') {
        const url = mode === 'REDIS' ? process.env.REDIS_URL! : FALLBACK_REDIS_URL;
        const redis = new Redis(url);
        await redis.set('quotes', JSON.stringify(quotes));
        redis.quit();
        return;
    }

    if (mode === 'VERCEL_KV') {
        await kv.set('quotes', quotes);
        return;
    }

    // Local
    if (!fs.existsSync(dataDirectory)) fs.mkdirSync(dataDirectory);
    fs.writeFileSync(quotesFilePath, JSON.stringify(quotes, null, 2));
}

// --- Public API ---

export async function getQuotes(): Promise<Quote[]> {
    return await fetchQuotes();
}

export async function saveQuote(quote: Omit<Quote, 'id'>) {
    const quotes = await fetchQuotes();
    const newQuote = { ...quote, id: Date.now().toString() };
    quotes.push(newQuote);
    await writeQuotes(quotes);
    return newQuote;
}

export async function getRandomQuote(category: Category): Promise<string> {
    const quotes = await fetchQuotes();
    const filtered = quotes.filter((q) => q.category === category);
    if (filtered.length === 0) return "No quote found.";
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex].text;
}
