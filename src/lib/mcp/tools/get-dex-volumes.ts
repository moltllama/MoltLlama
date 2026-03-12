import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";

export function registerGetDexVolumes(server: McpServer) {
  server.tool(
    "get_dex_volumes",
    "Get DEX volume overview and per-protocol volumes. Returns top 100 DEXs with 24h/7d/30d volume data and historical chart.",
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

      const volumeData = await dataProvider.getDexVolumes(defiLlamaChain);
      if (!volumeData) {
        return {
          content: [
            {
              type: "text" as const,
              text: "Error: Failed to fetch DEX volume data from DeFiLlama",
            },
          ],
          isError: true,
        };
      }

      const supportedChainNames = new Set(
        SUPPORTED_CHAINS.map((c) => c.defiLlamaName),
      );

      const filteredProtocols = volumeData.protocols
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
          total24h: p.total24h,
          total7d: p.total7d,
          total30d: p.total30d,
          totalAllTime: p.totalAllTime,
          change_1d: p.change_1d,
          change_7d: p.change_7d,
          change_1m: p.change_1m,
        }));

      const data = {
        overview: {
          total24h: volumeData.total24h,
          total7d: volumeData.total7d,
          total30d: volumeData.total30d,
          change_1d: volumeData.change_1d,
          change_7d: volumeData.change_7d,
          change_1m: volumeData.change_1m,
        },
        protocols: filteredProtocols,
        totalProtocols: filteredProtocols.length,
        chart: volumeData.totalDataChart.slice(-30),
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data) }],
      };
    },
  );
}
