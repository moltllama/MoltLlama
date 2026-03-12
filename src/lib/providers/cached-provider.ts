import { cacheGet, cacheSet } from "@/lib/cache";
import { CACHE_TTL } from "@/lib/cache/ttl";
import type { DataProvider } from "./types";
import type {
  DefiLlamaProtocol,
  DefiLlamaProtocolDetail,
  ChainTvlEntry,
  TokenPricesResponse,
  DexVolumeOverview,
  FeeOverview,
  YieldPool,
  BorrowPool,
} from "@/lib/defillama/types";

/**
 * Wraps any DataProvider with the two-tier cache (Redis + LRU).
 * Cache keys and TTLs are identical to the original DefiLlamaClient
 * so existing Redis entries continue working during migration.
 */
export class CachedDataProvider implements DataProvider {
  readonly name = "CachedProvider";

  constructor(private readonly inner: DataProvider) {}

  async getProtocols(): Promise<DefiLlamaProtocol[] | null> {
    const cacheKey = "defillama:protocols";
    const cached = await cacheGet<DefiLlamaProtocol[]>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getProtocols();
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.PROTOCOLS);
    return data;
  }

  async getProtocol(slug: string): Promise<DefiLlamaProtocolDetail | null> {
    const cacheKey = `defillama:protocol:${slug}`;
    const cached = await cacheGet<DefiLlamaProtocolDetail>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getProtocol(slug);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.PROTOCOL_DETAIL);
    return data;
  }

  async getChainTvl(chain: string): Promise<ChainTvlEntry[] | null> {
    const cacheKey = `defillama:chain-tvl:${chain}`;
    const cached = await cacheGet<ChainTvlEntry[]>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getChainTvl(chain);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.CHAIN_TVL);
    return data;
  }

  async getTokenPrices(coins: string[]): Promise<TokenPricesResponse | null> {
    if (coins.length === 0) return null;

    const coinsParam = coins.join(",");
    const cacheKey = `defillama:prices:${coinsParam}`;
    const cached = await cacheGet<TokenPricesResponse>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getTokenPrices(coins);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.TOKEN_PRICES);
    return data;
  }

  async getDexVolumes(chain?: string): Promise<DexVolumeOverview | null> {
    const chainSuffix = chain ? `/${chain}` : "";
    const cacheKey = `defillama:dex-volumes${chainSuffix}`;
    const cached = await cacheGet<DexVolumeOverview>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getDexVolumes(chain);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.DEX_VOLUMES);
    return data;
  }

  async getFees(chain?: string): Promise<FeeOverview | null> {
    const chainSuffix = chain ? `/${chain}` : "";
    const cacheKey = `defillama:fees${chainSuffix}`;
    const cached = await cacheGet<FeeOverview>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getFees(chain);
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.FEES);
    return data;
  }

  async getYieldPools(): Promise<YieldPool[] | null> {
    const cacheKey = "defillama:yield-pools";
    const cached = await cacheGet<YieldPool[]>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getYieldPools();
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.YIELD_POOLS);
    return data;
  }

  async getBorrowPools(): Promise<BorrowPool[] | null> {
    const cacheKey = "defillama:borrow-pools";
    const cached = await cacheGet<BorrowPool[]>(cacheKey);
    if (cached) return cached;

    const data = await this.inner.getBorrowPools();
    if (data) await cacheSet(cacheKey, data, CACHE_TTL.YIELD_POOLS);
    return data;
  }
}
