import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import type { YieldPool } from "@/lib/defillama/types";

const VALID_SORT_FIELDS = ["apy", "tvl"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

function getSortValue(pool: YieldPool, sort: SortField): number {
  switch (sort) {
    case "apy":
      return pool.apy ?? 0;
    case "tvl":
      return pool.tvlUsd ?? 0;
    default:
      return pool.apy ?? 0;
  }
}

export function registerGetYields(server: McpServer) {
  server.tool(
    "get_yields",
    "List yield farming opportunities across DeFi protocols. Supports filtering by chain, protocol, minimum APY, and stablecoin-only pools.",
    {
      chain: z
        .string()
        .optional()
        .describe("Filter by chain slug (e.g. 'base', 'ethereum')"),
      protocol: z
        .string()
        .optional()
        .describe("Filter by protocol slug (e.g. 'aave-v3')"),
      minApy: z
        .number()
        .optional()
        .describe("Minimum APY percentage"),
      stableOnly: z
        .boolean()
        .optional()
        .describe("Only include stablecoin pools"),
      limit: z
        .number()
        .min(1)
        .max(500)
        .optional()
        .describe("Maximum number of results (default 100, max 500)"),
      sort: z
        .enum(["apy", "tvl"])
        .optional()
        .describe("Sort field (default 'apy')"),
    },
    async ({ chain, protocol, minApy, stableOnly, limit, sort }) => {
      const chainParam = chain?.toLowerCase();
      const protocolParam = protocol?.toLowerCase();
      const effectiveMinApy = minApy ?? 0;
      const effectiveStableOnly = stableOnly ?? false;
      const effectiveLimit = limit ?? 100;
      const effectiveSort: SortField = sort ?? "apy";

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

      const pools = await dataProvider.getYieldPools();
      if (!pools) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Failed to fetch yield pools from DeFiLlama",
            },
          ],
          isError: true,
        };
      }

      const chainNameMap = new Map(
        SUPPORTED_CHAINS.map((c) => [c.slug, c.defiLlamaName]),
      );

      const targetChainNames: Set<string> = chainParam
        ? new Set([chainNameMap.get(chainParam)!])
        : new Set(SUPPORTED_CHAINS.map((c) => c.defiLlamaName));

      let filtered = pools.filter((pool) => {
        if (!targetChainNames.has(pool.chain)) return false;
        if (protocolParam && pool.project.toLowerCase() !== protocolParam)
          return false;
        if (pool.apy !== null && pool.apy < effectiveMinApy) return false;
        if (pool.apy === null && effectiveMinApy > 0) return false;
        if (effectiveStableOnly && !pool.stablecoin) return false;
        return true;
      });

      filtered.sort(
        (a, b) =>
          getSortValue(b, effectiveSort) - getSortValue(a, effectiveSort),
      );
      filtered = filtered.slice(0, effectiveLimit);

      const data = filtered.map((pool) => ({
        pool: pool.pool,
        chain: pool.chain,
        project: pool.project,
        symbol: pool.symbol,
        tvlUsd: pool.tvlUsd,
        apy: pool.apy,
        apyBase: pool.apyBase,
        apyReward: pool.apyReward,
        apyMean30d: pool.apyMean30d,
        stablecoin: pool.stablecoin,
        ilRisk: pool.ilRisk,
        exposure: pool.exposure,
        rewardTokens: pool.rewardTokens,
        underlyingTokens: pool.underlyingTokens,
        poolMeta: pool.poolMeta,
        volumeUsd1d: pool.volumeUsd1d,
        volumeUsd7d: pool.volumeUsd7d,
        predictions: pool.predictions,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ pools: data, total: data.length }),
          },
        ],
      };
    },
  );
}
