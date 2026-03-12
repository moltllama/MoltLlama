import { CircuitBreaker } from "./health";
import type { DataProvider, DataMethodName } from "./types";
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
 * Tries providers in order with per-provider circuit breakers.
 * A `null` return from a provider means "I can't serve this" —
 * the manager moves to the next provider in the chain.
 */
export class DataProviderManager implements DataProvider {
  readonly name = "ProviderManager";
  private readonly breakers: Map<string, CircuitBreaker>;

  constructor(private readonly providers: DataProvider[]) {
    this.breakers = new Map(
      providers.map((p) => [p.name, new CircuitBreaker(p.name)]),
    );
  }

  private async executeWithFallback<T>(
    methodName: DataMethodName,
    fn: (provider: DataProvider) => Promise<T | null>,
  ): Promise<T | null> {
    for (const provider of this.providers) {
      const breaker = this.breakers.get(provider.name)!;

      if (!breaker.isAvailable()) {
        continue;
      }

      try {
        const result = await fn(provider);
        if (result !== null) {
          breaker.recordSuccess();
          return result;
        }
        // null = unsupported or empty result, try next
        breaker.recordFailure();
      } catch (err) {
        breaker.recordFailure();
        console.warn(
          `[ProviderManager] ${provider.name}.${methodName}() threw:`,
          err,
        );
      }
    }

    return null;
  }

  async getProtocols(): Promise<DefiLlamaProtocol[] | null> {
    return this.executeWithFallback("getProtocols", (p) => p.getProtocols());
  }

  async getProtocol(slug: string): Promise<DefiLlamaProtocolDetail | null> {
    return this.executeWithFallback("getProtocol", (p) => p.getProtocol(slug));
  }

  async getChainTvl(chain: string): Promise<ChainTvlEntry[] | null> {
    return this.executeWithFallback("getChainTvl", (p) => p.getChainTvl(chain));
  }

  async getTokenPrices(coins: string[]): Promise<TokenPricesResponse | null> {
    return this.executeWithFallback("getTokenPrices", (p) => p.getTokenPrices(coins));
  }

  async getDexVolumes(chain?: string): Promise<DexVolumeOverview | null> {
    return this.executeWithFallback("getDexVolumes", (p) => p.getDexVolumes(chain));
  }

  async getFees(chain?: string): Promise<FeeOverview | null> {
    return this.executeWithFallback("getFees", (p) => p.getFees(chain));
  }

  async getYieldPools(): Promise<YieldPool[] | null> {
    return this.executeWithFallback("getYieldPools", (p) => p.getYieldPools());
  }

  async getBorrowPools(): Promise<BorrowPool[] | null> {
    return this.executeWithFallback("getBorrowPools", (p) => p.getBorrowPools());
  }
}
