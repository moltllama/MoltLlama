import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import type { DefiLlamaProtocol } from "@/lib/defillama/types";

const VALID_SORT_FIELDS = ["tvl", "change_1d", "change_7d"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

function getSortValue(p: DefiLlamaProtocol, sort: SortField): number {
  switch (sort) {
    case "tvl":
      return p.tvl ?? 0;
    case "change_1d":
      return p.change_1d ?? 0;
    case "change_7d":
      return p.change_7d ?? 0;
    default:
      return p.tvl ?? 0;
  }
}

export function registerListProtocols(server: McpServer) {
  server.tool(
    "list_protocols",
    "List DeFi protocols with TVL, category, and change metrics. Filters to supported chains (Base + Ethereum) by default.",
    {
      chain: z
        .string()
        .optional()
        .describe("Filter by chain slug (e.g. 'base', 'ethereum')"),
      category: z
        .string()
        .optional()
        .describe("Filter by protocol category (e.g. 'lending', 'dex')"),
      minTvl: z
        .number()
        .optional()
        .describe("Minimum TVL in USD"),
      limit: z
        .number()
        .min(1)
        .max(500)
        .optional()
        .describe("Maximum number of results (default 100, max 500)"),
      sort: z
        .enum(["tvl", "change_1d", "change_7d"])
        .optional()
        .describe("Sort field (default 'tvl')"),
    },
    async ({ chain, category, minTvl, limit, sort }) => {
      const chainFilter = chain?.toLowerCase();
      const categoryFilter = category?.toLowerCase();
      const effectiveMinTvl = minTvl ?? 0;
      const effectiveLimit = limit ?? 100;
      const effectiveSort: SortField = sort ?? "tvl";

      // Validate chain param
      if (chainFilter) {
        const validChain = SUPPORTED_CHAINS.find((c) => c.slug === chainFilter);
        if (!validChain) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Error: Unsupported chain "${chainFilter}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
              },
            ],
            isError: true,
          };
        }
      }

      const protocols = await dataProvider.getProtocols();
      if (!protocols) {
        return {
          content: [
            { type: "text" as const, text: "Error: Failed to fetch protocols from DeFiLlama" },
          ],
          isError: true,
        };
      }

      const targetChains = chainFilter
        ? [SUPPORTED_CHAINS.find((c) => c.slug === chainFilter)!.defiLlamaName]
        : SUPPORTED_CHAINS.map((c) => c.defiLlamaName);

      let filtered = protocols.filter((p) => {
        const onTargetChain = p.chains.some((c) => targetChains.includes(c));
        if (!onTargetChain) return false;
        if (categoryFilter && p.category.toLowerCase() !== categoryFilter)
          return false;
        if (p.tvl < effectiveMinTvl) return false;
        return true;
      });

      filtered.sort((a, b) => getSortValue(b, effectiveSort) - getSortValue(a, effectiveSort));
      filtered = filtered.slice(0, effectiveLimit);

      const data = filtered.map((p) => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
        chains: p.chains.filter((c) => targetChains.includes(c)),
        tvl: p.tvl,
        change_1h: p.change_1h,
        change_1d: p.change_1d,
        change_7d: p.change_7d,
        chainTvls: Object.fromEntries(
          Object.entries(p.chainTvls).filter(([c]) => targetChains.includes(c)),
        ),
        logo: p.logo,
        symbol: p.symbol,
        mcap: p.mcap ?? null,
        fdv: p.fdv ?? null,
        staking: p.staking ?? null,
        url: p.url,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ protocols: data, total: data.length }),
          },
        ],
      };
    },
  );
}
