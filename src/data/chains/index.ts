import type { ChainConfig, TokenConfig } from "@/data/chains/base";
import { BASE_CHAIN } from "@/data/chains/base";
import { ETHEREUM_CHAIN } from "@/data/chains/ethereum";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import type { SupportedChain } from "@/lib/constants";

export type { ChainConfig, TokenConfig } from "@/data/chains/base";
export { BASE_CHAIN } from "@/data/chains/base";
export { ETHEREUM_CHAIN } from "@/data/chains/ethereum";

/**
 * Central chain registry indexed by chain slug.
 * Use this to look up any registered chain by its unique identifier.
 */
export const CHAINS: Record<string, ChainConfig> = {
  [BASE_CHAIN.slug]: BASE_CHAIN,
  [ETHEREUM_CHAIN.slug]: ETHEREUM_CHAIN,
};

// ---------------------------------------------------------------------------
// Legacy token entry format (backward compatibility)
// ---------------------------------------------------------------------------

export interface TokenEntry {
  symbol: string;
  address: string;
  decimals: number;
  /** DeFiLlama coin identifier, e.g. "ethereum:0xA0b8..." */
  coinId: string;
  isNative?: boolean;
}

/**
 * Build a DeFiLlama coin identifier for a given chain + token address.
 */
function buildCoinId(chainSlug: string, address: string, isNative: boolean): string {
  if (isNative) return "coingecko:ethereum";
  return `${chainSlug}:${address}`;
}

/**
 * Convert the new ChainConfig token format to the legacy TokenEntry[] format.
 */
function toTokenEntries(chainSlug: string): TokenEntry[] {
  const chain = CHAINS[chainSlug];
  if (!chain) return [];

  return Object.entries(chain.tokens).map(([symbol, config]) => {
    const isNative = symbol === "ETH" && chainSlug !== "ethereum";
    return {
      symbol,
      address: config.address,
      decimals: config.decimals,
      coinId: buildCoinId(chainSlug, config.address, isNative),
      isNative: isNative || undefined,
    };
  });
}

/**
 * Legacy CHAIN_TOKENS registry indexed by chain slug.
 * Returns TokenEntry[] arrays for backward compatibility.
 */
export const CHAIN_TOKENS: Record<string, TokenEntry[]> = Object.fromEntries(
  Object.keys(CHAINS).map((slug) => [slug, toTokenEntries(slug)])
);

// ---------------------------------------------------------------------------
// Primary lookup helpers
// ---------------------------------------------------------------------------

/**
 * Get a chain config by its slug.
 * @param slug - The chain slug (e.g., "base", "ethereum")
 * @returns The chain config or undefined if not found
 */
export function getChain(slug: string): ChainConfig | undefined {
  return CHAINS[slug];
}

/**
 * Get all token configs for a specific chain.
 * @param chainSlug - The chain slug (e.g., "base", "ethereum")
 * @returns Record of token symbol to token config, or empty object if chain not found
 */
export function getChainTokens(
  chainSlug: string
): TokenEntry[] {
  return CHAIN_TOKENS[chainSlug] ?? [];
}

/**
 * Get a specific token config on a specific chain.
 * @param chainSlug - The chain slug
 * @param tokenSymbol - The token symbol (e.g., "USDC", "ETH")
 * @returns The token config or undefined if not found
 */
export function getToken(
  chainSlug: string,
  tokenSymbol: string
): TokenConfig | undefined {
  return CHAINS[chainSlug]?.tokens[tokenSymbol];
}

/**
 * Get all registered chain slugs.
 * @returns Array of all chain slug strings
 */
export function getAllChainSlugs(): string[] {
  return Object.keys(CHAINS);
}

// ---------------------------------------------------------------------------
// Legacy helpers (backward compatibility)
// ---------------------------------------------------------------------------

/**
 * Get the SupportedChain config by slug.
 * @deprecated Use getChain() instead for the full ChainConfig.
 */
export function getChainConfig(slug: string): SupportedChain | undefined {
  return SUPPORTED_CHAINS.find((c) => c.slug === slug);
}

/**
 * Resolve a token symbol to a DeFiLlama coin identifier.
 * Searches the specified chain first; if not found, searches all chains.
 */
export function resolveTokenCoinId(
  symbol: string,
  chainSlug?: string
): string | null {
  const upper = symbol.toUpperCase();

  if (chainSlug) {
    const tokens = CHAIN_TOKENS[chainSlug];
    if (tokens) {
      const match = tokens.find((t) => t.symbol.toUpperCase() === upper);
      if (match) return match.coinId;
    }
  }

  // Search all chains
  for (const tokens of Object.values(CHAIN_TOKENS)) {
    const match = tokens.find((t) => t.symbol.toUpperCase() === upper);
    if (match) return match.coinId;
  }

  return null;
}
