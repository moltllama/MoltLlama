import type { DataProvider } from "../types";
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
import { CoinGeckoClient } from "./client";
import { resolveCoins, adaptPrices, type CoinGeckoSimplePrice } from "./adapter";

/**
 * CoinGecko fallback provider.
 * Currently supports: getTokenPrices.
 * All other methods return null (unsupported).
 */
export class CoinGeckoProvider implements DataProvider {
  readonly name = "CoinGecko";
  private readonly client = new CoinGeckoClient();

  async getTokenPrices(coins: string[]): Promise<TokenPricesResponse | null> {
    if (coins.length === 0) return null;

    const coinMap = resolveCoins(coins);
    if (coinMap.size === 0) {
      // None of the requested coins have a CoinGecko mapping
      return null;
    }

    // Deduplicate CoinGecko IDs
    const seen = new Set<string>();
    coinMap.forEach((cgId) => seen.add(cgId));
    const idsParam = Array.from(seen).join(",");

    const data = await this.client.fetchJson<CoinGeckoSimplePrice>(
      `/simple/price?ids=${encodeURIComponent(idsParam)}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`,
    );
    if (!data) return null;

    return adaptPrices(data, coinMap);
  }

  // --- Unsupported methods: return null so the manager tries next provider ---

  async getProtocols(): Promise<DefiLlamaProtocol[] | null> {
    return null;
  }

  async getProtocol(_slug: string): Promise<DefiLlamaProtocolDetail | null> {
    return null;
  }

  async getChainTvl(_chain: string): Promise<ChainTvlEntry[] | null> {
    return null;
  }

  async getDexVolumes(_chain?: string): Promise<DexVolumeOverview | null> {
    return null;
  }

  async getFees(_chain?: string): Promise<FeeOverview | null> {
    return null;
  }

  async getYieldPools(): Promise<YieldPool[] | null> {
    return null;
  }

  async getBorrowPools(): Promise<BorrowPool[] | null> {
    return null;
  }
}
