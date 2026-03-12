import type { TokenPricesResponse, TokenPrice } from "@/lib/defillama/types";

/**
 * Maps DeFiLlama coin identifiers to CoinGecko IDs.
 *
 * DeFiLlama uses `chain:address` or `coingecko:id` format.
 * CoinGecko uses simple string IDs like "ethereum", "usd-coin".
 */
const DEFILLAMA_TO_COINGECKO: Record<string, string> = {
  // coingecko: prefix (DeFiLlama native)
  "coingecko:ethereum": "ethereum",
  "coingecko:usd-coin": "usd-coin",
  "coingecko:bitcoin": "bitcoin",
  "coingecko:dai": "dai",
  "coingecko:wrapped-bitcoin": "wrapped-bitcoin",
  "coingecko:weth": "weth",
  "coingecko:tether": "tether",

  // Base chain tokens
  "base:0x4200000000000000000000000000000000000006": "ethereum",            // ETH
  "base:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": "usd-coin",           // USDC
  "base:0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf": "coinbase-wrapped-btc", // cbBTC
  "base:0x940181a94a35a4569e4529a3cdfb74e38fd98631": "aerodrome-finance",   // AERO
  "base:0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A": "ether-fi-staked-eth", // weETH
  "base:0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452": "wrapped-steth",      // wstETH
  "base:0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA": "bridged-usd-coin-base", // USDbC
  "base:0x532f27101965dd16442E59d40670FaF5eBB142E4": "based-brett",         // BRETT

  // Ethereum tokens
  "ethereum:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": "weth",             // WETH
  "ethereum:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": "usd-coin",         // USDC
  "ethereum:0xdAC17F958D2ee523a2206206994597C13D831ec7": "tether",            // USDT
  "ethereum:0x6B175474E89094C44Da98b954EedeAC495271d0F": "dai",               // DAI
  "ethereum:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": "wrapped-bitcoin",   // WBTC
  "ethereum:0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": "wrapped-steth",     // wstETH
  "ethereum:0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84": "staked-ether",      // stETH
  "ethereum:0x514910771AF9Ca656af840dff83E8264EcF986CA": "chainlink",         // LINK
  "ethereum:0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": "aave",             // AAVE
  "ethereum:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": "uniswap",          // UNI
  "ethereum:0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": "maker",            // MKR
  "ethereum:0xc00e94Cb662C3520282E6f5717214004A7f26888": "compound-governance-token", // COMP
  "ethereum:0xD533a949740bb3306d119CC777fa900bA034cd52": "curve-dao-token",   // CRV
  "ethereum:0xae78736Cd615f374D3085123A210448E74Fc6393": "rocket-pool-eth",   // rETH
  "ethereum:0xBe9895146f7AF43049ca1c1AE358B0541Ea49704": "coinbase-wrapped-staked-eth", // cbETH
};

/** CoinGecko /simple/price response shape */
interface CoinGeckoSimplePrice {
  [coinId: string]: {
    usd: number;
    usd_24h_change?: number;
    last_updated_at?: number;
  };
}

/**
 * Resolve DeFiLlama coin identifiers to CoinGecko IDs.
 * Returns a map of { defillamaId → coingeckoId } for recognized coins.
 */
export function resolveCoins(defillamaCoins: string[]): Map<string, string> {
  const resolved = new Map<string, string>();
  for (const coin of defillamaCoins) {
    const cgId = DEFILLAMA_TO_COINGECKO[coin];
    if (cgId) {
      resolved.set(coin, cgId);
    }
  }
  return resolved;
}

/**
 * Convert a CoinGecko /simple/price response into the DeFiLlama
 * `TokenPricesResponse` format.
 *
 * @param cgData    Raw CoinGecko response
 * @param coinMap   Map of { defillamaId → coingeckoId }
 */
export function adaptPrices(
  cgData: CoinGeckoSimplePrice,
  coinMap: Map<string, string>,
): TokenPricesResponse {
  const coins: Record<string, TokenPrice> = {};

  coinMap.forEach((cgId, dlId) => {
    const priceData = cgData[cgId];
    if (!priceData) return;

    const symbol = cgId.toUpperCase();

    coins[dlId] = {
      price: priceData.usd,
      symbol,
      timestamp: priceData.last_updated_at ?? Math.floor(Date.now() / 1000),
      confidence: 0.9, // fallback-sourced prices get lower confidence
    };
  });

  return { coins };
}

export type { CoinGeckoSimplePrice };
