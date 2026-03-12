import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";

export function registerGetFees(server: McpServer) {
  server.tool(
    "get_fees",
    "Get protocol fee and revenue overview. Returns top 100 protocols by fees with 24h/7d/30d fee and revenue data.",
    {
      chain: z
        .string()
        .optional()
        .describe("Filter by chain slug (e.g. 'base', 'ethereum')"),
    },
    async ({ chain }) => {
      const chainParam = chain?.toLowerCase();

      let defiLlamaChain: string | undefined;
      if (chainParam) {
        const chainConfig = SUPPORTED_CHAINS.find(
          (c) => c.slug === chainParam,
        );
        if (!chainConfig) {
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
        defiLlamaChain = chainConfig.defiLlamaName;
      }

      const feeData = await dataProvider.getFees(defiLlamaChain);
      if (!feeData) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Failed to fetch fee data from DeFiLlama",
            },
          ],
          isError: true,
        };
      }

      const supportedChainNames = new Set(
        SUPPORTED_CHAINS.map((c) => c.defiLlamaName),
      );

      const filteredProtocols = feeData.protocols
        .filter((p) => {
          if (chainParam) return true;
          return p.chains.some((c) => supportedChainNames.has(c));
        })
        .sort((a, b) => (b.total24h ?? 0) - (a.total24h ?? 0))
        .slice(0, 100)
        .map((p) => ({
          name: p.name,
          slug: p.slug,
          category: p.category,
          logo: p.logo,
          chains: p.chains.filter((c) => supportedChainNames.has(c)),
          fees: {
            total24h: p.total24h,
            total7d: p.total7d,
            total30d: p.total30d,
            totalAllTime: p.totalAllTime,
            change_1d: p.change_1d,
            change_7d: p.change_7d,
            change_1m: p.change_1m,
          },
          revenue: {
            revenue24h: p.revenue24h ?? null,
            revenue7d: p.revenue7d ?? null,
            revenue30d: p.revenue30d ?? null,
          },
        }));

      const data = {
        overview: {
          total24h: feeData.total24h,
          total7d: feeData.total7d,
          total30d: feeData.total30d,
          change_1d: feeData.change_1d,
          change_7d: feeData.change_7d,
          change_1m: feeData.change_1m,
        },
        protocols: filteredProtocols,
        totalProtocols: filteredProtocols.length,
        chart: feeData.totalDataChart.slice(-30),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data) }],
      };
    },
  );
}
