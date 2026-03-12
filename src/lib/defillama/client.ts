import { cacheGet, cacheSet } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/cache/ttl";
import { TokenBucket } from "@/lib/providers/token-bucket";
import type {
  DefiLlamaProtocol,
  DefiLlamaProtocolDetail,
  ChainTvlEntry,
  TokenPricesResponse,
  DexVolumeOverview,
  FeeOverview,
  YieldPoolsResponse,
  YieldPool,
  BorrowPool,
} from "./types";

// ---------------------------------------------------------------------------
// DefiLlama API client
// ---------------------------------------------------------------------------
export class DefiLlamaClient {
  private readonly baseUrl: string;
  private readonly coinsUrl: string;
  private readonly yieldsUrl: string;
  private readonly bucket = new TokenBucket(5, 5);

  constructor() {
    const proKey = process.env.DEFILLAMA_API_KEY;
    if (proKey) {
      this.baseUrl = `https://pro-api.llama.fi/${proKey}`;
      this.coinsUrl = `https://pro-api.llama.fi/${proKey}/coins`;
      this.yieldsUrl = `https://pro-api.llama.fi/${proKey}/yields`;
    } else {
      this.baseUrl = "https://api.llama.fi";
      this.coinsUrl = "https://coins.llama.fi";
      this.yieldsUrl = "https://yields.llama.fi";
    }
  }

  // -----------------------------------------------------------------------
  // Internal fetch helper
  // -----------------------------------------------------------------------
  private async fetchJson<T>(url: string): Promise<T | null> {
    await this.bucket.acquire();
    try {
      const res = await fetch(url, {
        headers: { "Accept": "application/json" },
        // Next.js fetch cache – disable automatic caching (we manage our own)
        next: { revalidate: 0 },
      } as RequestInit);
      if (!res.ok) {
        console.error(`[DefiLlama] HTTP ${res.status} for ${url}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.error(`[DefiLlama] Fetch error for ${url}:`, err);
      return null;
    }
  }

  // -----------------------------------------------------------------------
  // Protocols
  // -----------------------------------------------------------------------
  async getProtocols(): Promise<DefiLlamaProtocol[] | null> {
    const cacheKey = "defillama:protocols";
    const cached = await cacheGet<DefiLlamaProtocol[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<DefiLlamaProtocol[]>(`${this.baseUrl}/protocols`);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.PROTOCOLS);
    return data;
  }

  // -----------------------------------------------------------------------
  // Protocol detail
  // -----------------------------------------------------------------------
  async getProtocol(slug: string): Promise<DefiLlamaProtocolDetail | null> {
    const cacheKey = `defillama:protocol:${slug}`;
    const cached = await cacheGet<DefiLlamaProtocolDetail>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<DefiLlamaProtocolDetail>(`${this.baseUrl}/protocol/${slug}`);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.PROTOCOL_DETAIL);
    return data;
  }

  // -----------------------------------------------------------------------
  // Chain TVL history
  // -----------------------------------------------------------------------
  async getChainTvl(chain: string): Promise<ChainTvlEntry[] | null> {
    const cacheKey = `defillama:chain-tvl:${chain}`;
    const cached = await cacheGet<ChainTvlEntry[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<ChainTvlEntry[]>(`${this.baseUrl}/v2/historicalChainTvl/${chain}`);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.CHAIN_TVL);
    return data;
  }

  // -----------------------------------------------------------------------
  // Token prices (batch)
  // -----------------------------------------------------------------------
  async getTokenPrices(coins: string[]): Promise<TokenPricesResponse | null> {
    if (coins.length === 0) return null;

    const coinsParam = coins.join(",");
    const cacheKey = `defillama:prices:${coinsParam}`;
    const cached = await cacheGet<TokenPricesResponse>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<TokenPricesResponse>(
      `${this.coinsUrl}/prices/current/${encodeURIComponent(coinsParam)}`,
    );
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.TOKEN_PRICES);
    return data;
  }

  // -----------------------------------------------------------------------
  // DEX volumes
  // -----------------------------------------------------------------------
  async getDexVolumes(chain?: string): Promise<DexVolumeOverview | null> {
    const chainSuffix = chain ? `/${chain}` : "";
    const cacheKey = `defillama:dex-volumes${chainSuffix}`;
    const cached = await cacheGet<DexVolumeOverview>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<DexVolumeOverview>(
      `${this.baseUrl}/overview/dexs${chainSuffix}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true`,
    );
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.DEX_VOLUMES);
    return data;
  }

  // -----------------------------------------------------------------------
  // Fees
  // -----------------------------------------------------------------------
  async getFees(chain?: string): Promise<FeeOverview | null> {
    const chainSuffix = chain ? `/${chain}` : "";
    const cacheKey = `defillama:fees${chainSuffix}`;
    const cached = await cacheGet<FeeOverview>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<FeeOverview>(
      `${this.baseUrl}/overview/fees${chainSuffix}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true`,
    );
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.FEES);
    return data;
  }

  // -----------------------------------------------------------------------
  // Yield pools
  // -----------------------------------------------------------------------
  async getYieldPools(): Promise<YieldPool[] | null> {
    const cacheKey = "defillama:yield-pools";
    const cached = await cacheGet<YieldPool[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<YieldPoolsResponse>(`${this.yieldsUrl}/pools`);
    if (data?.data) {
      await cacheSet(cacheKey, data.data, CACHE_TTL.YIELD_POOLS);
      return data.data;
    }
    return null;
  }

  // -----------------------------------------------------------------------
  // Borrow pools (yield pools filtered to those with borrow data)
  // -----------------------------------------------------------------------
  async getBorrowPools(): Promise<BorrowPool[] | null> {
    const cacheKey = "defillama:borrow-pools";
    const cached = await cacheGet<BorrowPool[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchJson<YieldPoolsResponse>(`${this.yieldsUrl}/poolsBorrow`);
    if (data?.data) {
      const borrowPools = data.data as BorrowPool[];
      await cacheSet(cacheKey, borrowPools, CACHE_TTL.YIELD_POOLS);
      return borrowPools;
    }
    return null;
  }
}
