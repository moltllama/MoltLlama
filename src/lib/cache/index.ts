import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";

// In-memory fallback cache
const memoryCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 min default
});

// Upstash Redis client (lazy init)
let redis: Redis | null = null;
function getRedis(): Redis | null {
  if (redis) return redis;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  }
  return null;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  // Try Redis first
  const r = getRedis();
  if (r) {
    try {
      const val = await r.get<T>(key);
      if (val !== null && val !== undefined) return val;
    } catch {
      // Fall through to memory cache
    }
  }
  // Fallback to memory
  const memVal = memoryCache.get(key);
  if (memVal) return JSON.parse(memVal) as T;
  return null;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const serialized = JSON.stringify(value);

  // Set in Redis
  const r = getRedis();
  if (r) {
    try {
      await r.set(key, value, { ex: ttlSeconds });
    } catch {
      // Continue with memory cache
    }
  }
  // Always set in memory too (for same-invocation reads)
  memoryCache.set(key, serialized, { ttl: ttlSeconds * 1000 });
}
