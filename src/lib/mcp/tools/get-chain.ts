import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { getChainConfig } from "@/data/chains";

export function registerGetChain(server: McpServer) {
  server.tool(
    "get_chain",
    "Get chain TVL overview including current TVL, 24h/7d changes, TVL history (last 90 days), and top 20 protocols on the chain.",
    {
      chain: z
        .string()
        .describe("Chain slug (e.g. 'base', 'ethereum')"),
    },
    async ({ chain }) => {
      const chainSlug = chain.toLowerCase();
      const chainConfig = getChainConfig(chainSlug);

      if (!chainConfig) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Unsupported chain "${chainSlug}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      const [tvlHistory, allProtocols] = await Promise.all([
        dataProvider.getChainTvl(chainConfig.defiLlamaName),
        dataProvider.getProtocols(),
      ]);

      if (!tvlHistory) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Failed to fetch TVL data for chain "${chainSlug}"`,
            },
          ],
          isError: true,
        };
      }

      const currentTvl =
        tvlHistory.length > 0 ? tvlHistory[tvlHistory.length - 1].tvl : 0;

      const oneDayAgo =
        tvlHistory.length > 1
          ? tvlHistory[tvlHistory.length - 2].tvl
          : currentTvl;
      const sevenDaysAgo =
        tvlHistory.length > 7
          ? tvlHistory[tvlHistory.length - 8].tvl
          : currentTvl;

      const change1d =
        oneDayAgo > 0 ? ((currentTvl - oneDayAgo) / oneDayAgo) * 100 : 0;
      const change7d =
        sevenDaysAgo > 0
          ? ((currentTvl - sevenDaysAgo) / sevenDaysAgo) * 100
          : 0;

      let topProtocols: {
        slug: string;
        name: string;
        category: string;
        tvl: number;
        change_1d: number | null;
        change_7d: number | null;
        logo: string;
      }[] = [];

      if (allProtocols) {
        const chainProtocols = allProtocols
          .filter((p) => p.chains.includes(chainConfig.defiLlamaName))
          .sort((a, b) => {
            const tvlA = a.chainTvls[chainConfig.defiLlamaName] ?? 0;
            const tvlB = b.chainTvls[chainConfig.defiLlamaName] ?? 0;
            return tvlB - tvlA;
          })
          .slice(0, 20);

        topProtocols = chainProtocols.map((p) => ({
          slug: p.slug,
          name: p.name,
          category: p.category,
          tvl: p.chainTvls[chainConfig.defiLlamaName] ?? p.tvl,
          change_1d: p.change_1d,
          change_7d: p.change_7d,
          logo: p.logo,
        }));
      }

      const recentHistory = tvlHistory.slice(-90);

      const data = {
        chain: {
          name: chainConfig.name,
          slug: chainConfig.slug,
          chainId: chainConfig.chainId,
        },
        tvl: {
          current: currentTvl,
          change1d: Math.round(change1d * 100) / 100,
          change7d: Math.round(change7d * 100) / 100,
        },
        tvlHistory: recentHistory,
        topProtocols,
        protocolCount: allProtocols
          ? allProtocols.filter((p) =>
              p.chains.includes(chainConfig.defiLlamaName),
            ).length
          : 0,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data) }],
      };
    },
  );
}
