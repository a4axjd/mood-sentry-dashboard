const Redis = require('ioredis');

const REDIS_URL = "redis://default:9x4w77bsxs0p2STlMRSEpRvYYfzvUSOX@redis-15756.crce179.ap-south-1-1.ec2.cloud.redislabs.com:15756";

console.log("Testing connection to:", REDIS_URL);

const redis = new Redis(REDIS_URL);

redis.on('error', (err) => {
    console.error("Redis connection error:", err);
    process.exit(1);
});

redis.on('connect', () => {
    console.log("Successfully connected to Redis!");
});

async function test() {
    try {
        await redis.set('test-key', 'Hello from Vercel Debugger');
        const val = await redis.get('test-key');
        console.log("Read back value:", val);
        redis.disconnect();
        process.exit(0);
    } catch (e) {
        console.error("Operation failed:", e);
        process.exit(1);
    }
}

test();
