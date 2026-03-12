import { TokenBucket } from "./token-bucket";
import type { DataProvider } from "./types";
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
} from "@/lib/defillama/types";

/**
 * Primary data provider — wraps the DeFiLlama API without any cache logic.
 * All 8 methods are supported.
 */
export class DefiLlamaProvider implements DataProvider {
  readonly name = "DeFiLlama";

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

  private async fetchJson<T>(url: string): Promise<T | null> {
    await this.bucket.acquire();
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      } as RequestInit);
      if (!res.ok) {
        console.error(`[DefiLlamaProvider] HTTP ${res.status} for ${url}`);
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      console.error(`[DefiLlamaProvider] Fetch error for ${url}:`, err);
      return null;
    }
  }

  async getProtocols(): Promise<DefiLlamaProtocol[] | null> {
    return this.fetchJson<DefiLlamaProtocol[]>(`${this.baseUrl}/protocols`);
  }

  async getProtocol(slug: string): Promise<DefiLlamaProtocolDetail | null> {
    return this.fetchJson<DefiLlamaProtocolDetail>(`${this.baseUrl}/protocol/${slug}`);
  }

  async getChainTvl(chain: string): Promise<ChainTvlEntry[] | null> {
    return this.fetchJson<ChainTvlEntry[]>(`${this.baseUrl}/v2/historicalChainTvl/${chain}`);
  }

  async getTokenPrices(coins: string[]): Promise<TokenPricesResponse | null> {
    if (coins.length === 0) return null;
    const coinsParam = coins.join(",");
    return this.fetchJson<TokenPricesResponse>(
      `${this.coinsUrl}/prices/current/${encodeURIComponent(coinsParam)}`,
    );
  }

  async getDexVolumes(chain?: string): Promise<DexVolumeOverview | null> {
    const chainSuffix = chain ? `/${chain}` : "";
    return this.fetchJson<DexVolumeOverview>(
      `${this.baseUrl}/overview/dexs${chainSuffix}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true`,
    );
  }

  async getFees(chain?: string): Promise<FeeOverview | null> {
    const chainSuffix = chain ? `/${chain}` : "";
    return this.fetchJson<FeeOverview>(
      `${this.baseUrl}/overview/fees${chainSuffix}?excludeTotalDataChart=false&excludeTotalDataChartBreakdown=true`,
    );
  }

  async getYieldPools(): Promise<YieldPool[] | null> {
    const data = await this.fetchJson<YieldPoolsResponse>(`${this.yieldsUrl}/pools`);
    return data?.data ?? null;
  }

  async getBorrowPools(): Promise<BorrowPool[] | null> {
    const data = await this.fetchJson<YieldPoolsResponse>(`${this.yieldsUrl}/poolsBorrow`);
    return data?.data as BorrowPool[] ?? null;
  }
}
