import { dataProvider } from "@/lib/providers";
import { resolveTokenCoinId, getChainTokens } from "@/data/chains";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";

/**
 * GET /api/mcp/prices
 *
 * Returns current token prices from DeFiLlama.
 *
 * Query params:
 *   tokens - Required. Comma-separated token symbols (e.g. "ETH,USDC,DAI")
 *   chain  - Optional. Chain slug to resolve token addresses from.
 *            When omitted, searches all supported chains.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tokensParam = searchParams.get("tokens");
  const chainParam = searchParams.get("chain")?.toLowerCase();

  if (!tokensParam) {
    return mcpError("'tokens' query parameter is required (comma-separated symbols, e.g. ETH,USDC)");
  }

  // Validate chain if provided
  if (chainParam) {
    const validChain = SUPPORTED_CHAINS.find((c) => c.slug === chainParam);
    if (!validChain) {
      return mcpError(
        `Unsupported chain "${chainParam}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
      );
    }
  }

  // Parse token symbols
  const symbols = tokensParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (symbols.length === 0) {
    return mcpError("At least one token symbol is required");
  }

  if (symbols.length > 50) {
    return mcpError("Maximum 50 tokens per request");
  }

  // Resolve each symbol to a DeFiLlama coin identifier
  const resolved: { symbol: string; coinId: string }[] = [];
  const unresolved: string[] = [];

  for (const symbol of symbols) {
    const coinId = resolveTokenCoinId(symbol, chainParam);
    if (coinId) {
      resolved.push({ symbol, coinId });
    } else {
      unresolved.push(symbol);
    }
  }

  if (resolved.length === 0) {
    return mcpError(
      `Could not resolve any token symbols. Unknown tokens: ${unresolved.join(", ")}. ` +
      `Available tokens for ${chainParam ?? "all chains"}: ${getAvailableSymbols(chainParam)}`,
    );
  }

  // Fetch prices from DeFiLlama
  const coinIds = resolved.map((r) => r.coinId);
  const pricesResponse = await dataProvider.getTokenPrices(coinIds);

  if (!pricesResponse) {
    return mcpError("Failed to fetch token prices from DeFiLlama", 502);
  }

  // Build response mapping symbol -> price data
  const prices: Record<string, unknown> = {};

  for (const { symbol, coinId } of resolved) {
    const priceData = pricesResponse.coins[coinId];
    if (priceData) {
      prices[symbol] = {
        price: priceData.price,
        symbol: priceData.symbol,
        timestamp: priceData.timestamp,
        confidence: priceData.confidence,
        decimals: priceData.decimals ?? null,
        coinId,
      };
    } else {
      prices[symbol] = {
        price: null,
        error: "Price not available",
        coinId,
      };
    }
  }

  return mcpResponse(
    {
      prices,
      resolved: resolved.length,
      unresolved: unresolved.length > 0 ? unresolved : undefined,
    },
    {
      source: "defillama",
      ttl: CACHE_TTL.TOKEN_PRICES,
      chain: chainParam,
    },
  );
}

function getAvailableSymbols(chainSlug?: string): string {
  if (chainSlug) {
    return getChainTokens(chainSlug).map((t) => t.symbol).join(", ");
  }
  // Collect unique symbols across all chains
  const all = new Set<string>();
  for (const chain of SUPPORTED_CHAINS) {
    for (const t of getChainTokens(chain.slug)) {
      all.add(t.symbol);
    }
  }
  return Array.from(all).join(", ");
}
