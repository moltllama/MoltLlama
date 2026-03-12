import { TokenBucket } from "../token-bucket";

/**
 * Minimal CoinGecko HTTP client with rate limiting.
 * Free tier: 30 req/min → bucket of 2 tokens at 0.5 tokens/sec.
 */
export class CoinGeckoClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly bucket = new TokenBucket(2, 0.5);

  constructor() {
    this.apiKey = process.env.COINGECKO_API_KEY;
    this.baseUrl = this.apiKey
      ? "https://pro-api.coingecko.com/api/v3"
      : "https://api.coingecko.com/api/v3";
  }

  async fetchJson<T>(path: string): Promise<T | null> {
    await this.bucket.acquire();
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = { Accept: "application/json" };
    if (this.apiKey) {
      headers["x-cg-pro-api-key"] = this.apiKey;
    }
    try {
      const res = await fetch(url, {
        headers,
        next: { revalidate: 0 },
      } as RequestInit);
      if (!res.ok) {
        console.error(`[CoinGecko] HTTP ${res.status} for ${url}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.error(`[CoinGecko] Fetch error for ${url}:`, err);
      return null;
    }
  }
}
