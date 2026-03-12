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
 * Unified data provider interface.
 *
 * Each method returns `null` when the provider cannot serve the request
 * (unsupported method, API error, etc.). The manager interprets `null`
 * as "try the next provider in the fallback chain".
 */
export interface DataProvider {
  readonly name: string;

  getProtocols(): Promise<DefiLlamaProtocol[] | null>;
  getProtocol(slug: string): Promise<DefiLlamaProtocolDetail | null>;
  getChainTvl(chain: string): Promise<ChainTvlEntry[] | null>;
  getTokenPrices(coins: string[]): Promise<TokenPricesResponse | null>;
  getDexVolumes(chain?: string): Promise<DexVolumeOverview | null>;
  getFees(chain?: string): Promise<FeeOverview | null>;
  getYieldPools(): Promise<YieldPool[] | null>;
  getBorrowPools(): Promise<BorrowPool[] | null>;
}

/** Method names on the DataProvider interface (excluding `name`). */
export type DataMethodName = keyof Omit<DataProvider, "name">;

/** Health state tracked by the circuit breaker for a single provider. */
export interface ProviderHealth {
  consecutiveFailures: number;
  lastFailure: number | null;
  isOpen: boolean;
}
