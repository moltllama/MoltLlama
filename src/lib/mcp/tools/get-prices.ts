import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { resolveTokenCoinId, getChainTokens } from "@/data/chains";
import { SUPPORTED_CHAINS } from "@/lib/constants";

function getAvailableSymbols(chainSlug?: string): string {
  if (chainSlug) {
    return getChainTokens(chainSlug)
      .map((t) => t.symbol)
      .join(", ");
  }
  const all = new Set<string>();
  for (const chain of SUPPORTED_CHAINS) {
    for (const t of getChainTokens(chain.slug)) {
      all.add(t.symbol);
    }
  }
  return Array.from(all).join(", ");
}

export function registerGetPrices(server: McpServer) {
  server.tool(
    "get_prices",
    "Get current token prices from DeFiLlama. Accepts comma-separated token symbols and resolves them to on-chain addresses.",
    {
      tokens: z
        .string()
        .describe(
          "Comma-separated token symbols (e.g. 'ETH,USDC,DAI'). Max 50 tokens.",
        ),
      chain: z
        .string()
        .optional()
        .describe(
          "Chain slug to resolve token addresses from (default: searches all supported chains)",
        ),
    },
    async ({ tokens, chain }) => {
      const chainParam = chain?.toLowerCase();

      if (chainParam) {
        const validChain = SUPPORTED_CHAINS.find(
          (c) => c.slug === chainParam,
        );
        if (!validChain) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: Unsupported chain "${chainParam}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
              },
            ],
            isError: true,
          };
        }
      }

      const symbols = tokens
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (symbols.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: At least one token symbol is required",
            },
          ],
          isError: true,
        };
      }

      if (symbols.length > 50) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Maximum 50 tokens per request",
            },
          ],
          isError: true,
        };
      }

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
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Could not resolve any token symbols. Unknown tokens: ${unresolved.join(", ")}. Available tokens for ${chainParam ?? "all chains"}: ${getAvailableSymbols(chainParam)}`,
            },
          ],
          isError: true,
        };
      }

      const coinIds = resolved.map((r) => r.coinId);
      const pricesResponse = await dataProvider.getTokenPrices(coinIds);

      if (!pricesResponse) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Failed to fetch token prices from DeFiLlama",
            },
          ],
          isError: true,
        };
      }

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

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              prices,
              resolved: resolved.length,
              unresolved: unresolved.length > 0 ? unresolved : undefined,
            }),
          },
        ],
      };
    },
  );
}
