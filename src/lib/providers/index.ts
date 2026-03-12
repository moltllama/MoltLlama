import { DefiLlamaProvider } from "./defillama-provider";
import { CoinGeckoProvider } from "./coingecko/provider";
import { DataProviderManager } from "./manager";
import { CachedDataProvider } from "./cached-provider";

export type { DataProvider, DataMethodName, ProviderHealth } from "./types";

/**
 * Singleton data provider with fallback chain:
 *   DefiLlamaProvider → CoinGeckoProvider → DataProviderManager → CachedDataProvider
 *
 * Cache wraps the entire manager so a cache hit skips all providers entirely.
 */
export const dataProvider = new CachedDataProvider(
  new DataProviderManager([
    new DefiLlamaProvider(),
    new CoinGeckoProvider(),
  ]),
);
