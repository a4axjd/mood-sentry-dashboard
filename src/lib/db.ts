import { Pool } from 'pg';

export type Category = 'CALM' | 'SAD' | 'TIRED' | 'ALONE';

export interface Quote {
    id: string;
    text: string;
    category: Category;
}

const INITIAL_QUOTES: Omit<Quote, 'id'>[] = [
    { text: "Breathe in. Breathe out.", category: "CALM" },
    { text: "This too shall pass.", category: "SAD" },
    { text: "Rest is productive.", category: "TIRED" },
    { text: "You are your own best company.", category: "ALONE" }
];

let pool: Pool | null = null;

function getPool() {
    if (!pool) {
        if (!process.env.DATABASE_URL) {
            console.warn("DATABASE_URL not found. SQL will fail.");
            return null;
        }
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Required for Supabase/Neon usually
        });
    }
    return pool;
}

// Helper: Ensure table exists and seed if empty
async function initDB() {
    const db = getPool();
    if (!db) return;

    try {
        // Create table if not exists
        await db.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        text VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // Check count
        const res = await db.query('SELECT COUNT(*) FROM quotes');
        const count = parseInt(res.rows[0].count);

        if (count === 0) {
            console.log("Seeding database...");
            for (const q of INITIAL_QUOTES) {
                await db.query(
                    'INSERT INTO quotes (text, category) VALUES ($1, $2)',
                    [q.text, q.category]
                );
            }
        }
    } catch (err) {
        console.error("Failed to initialize DB:", err);
    }
}

// --- Public API ---

export async function getQuotes(): Promise<Quote[]> {
    try {
        await initDB();
        const db = getPool();
        if (!db) return [];

        const res = await db.query('SELECT * FROM quotes ORDER BY id DESC');
        return res.rows.map((r: any) => ({
            id: r.id.toString(),
            text: r.text,
            category: r.category as Category
        }));
    } catch (error) {
        console.error("SQL Error (getQuotes):", error);
        return [];
    }
}

export async function saveQuote(quote: Omit<Quote, 'id'>) {
    try {
        await initDB();
        const db = getPool();
        if (!db) throw new Error("Database not configured");

        const res = await db.query(
            'INSERT INTO quotes (text, category) VALUES ($1, $2) RETURNING id, text, category',
            [quote.text, quote.category]
        );
        const newRow = res.rows[0];
        return {
            id: newRow.id.toString(),
            text: newRow.text,
            category: newRow.category as Category
        };
    } catch (error) {
        console.error("SQL Error (saveQuote):", error);
        throw error;
    }
}

export async function getRandomQuote(category: Category): Promise<string> {
    try {
        await initDB();
        const db = getPool();
        if (!db) return "Database not configured.";

        // Optimized random fetch in SQL
        const res = await db.query(
            'SELECT text FROM quotes WHERE category = $1 ORDER BY RANDOM() LIMIT 1',
            [category]
        );

        if (res.rows.length > 0) {
            return res.rows[0].text;
        }

        return "No quote found for this mood.";
    } catch (error) {
        console.error("SQL Error (getRandomQuote):", error);
        return "Database connection error.";
    }
}
