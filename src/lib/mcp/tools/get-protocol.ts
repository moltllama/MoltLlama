import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { dataProvider } from "@/lib/providers";
import { getProtocol as getRegistryProtocol } from "@/data/protocols";

export function registerGetProtocol(server: McpServer) {
  server.tool(
    "get_protocol",
    "Get detailed protocol info including registry contract data, key functions, and supported tokens. Merges DeFiLlama data with local contract registry.",
    {
      slug: z
        .string()
        .describe("Protocol slug (e.g. 'aave-v3', 'uniswap-v3')"),
    },
    async ({ slug }) => {
      if (!slug) {
        return {
          content: [
            { type: "text" as const, text: "Error: Protocol slug is required" },
          ],
          isError: true,
        };
      }

      const protocolDetail = await dataProvider.getProtocol(slug);
      if (!protocolDetail) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Protocol "${slug}" not found on DeFiLlama`,
            },
          ],
          isError: true,
        };
      }

      const registryData = getRegistryProtocol(slug);

      const currentChainTvls = protocolDetail.currentChainTvls ?? {};
      const tvlHistory = protocolDetail.tvl
        ? protocolDetail.tvl.slice(-30)
        : [];

      const data: Record<string, unknown> = {
        slug: protocolDetail.slug,
        name: protocolDetail.name,
        category: protocolDetail.category,
        description: protocolDetail.description,
        url: protocolDetail.url,
        logo: protocolDetail.logo,
        symbol: protocolDetail.symbol,
        chains: protocolDetail.chains,
        currentChainTvls,
        tvlHistory,
        methodology: protocolDetail.methodology ?? null,
        mcap: protocolDetail.mcap ?? null,
        forkedFrom: protocolDetail.forkedFrom ?? null,
        auditLinks: protocolDetail.audit_links ?? null,
        raises: protocolDetail.raises ?? null,
        registry: null as Record<string, unknown> | null,
      };

      if (registryData) {
        data.registry = {
          category: registryData.category,
          website: registryData.website,
          docs: registryData.docs ?? null,
          github: registryData.github ?? null,
          chains: Object.fromEntries(
            Object.entries(registryData.chains).map(
              ([chainSlug, chainConfig]) => [
                chainSlug,
                {
                  contracts: chainConfig.contracts.map((c) => ({
                    name: c.name,
                    address: c.address,
                    purpose: c.purpose,
                    explorerUrl: c.explorerUrl,
                    keyFunctions: c.keyFunctions.map((fn) => ({
                      name: fn.name,
                      signature: fn.signature,
                      selector: fn.selector,
                      description: fn.description,
                      inputs: fn.inputs,
                      txPreparation: fn.txPreparation ?? null,
                    })),
                  })),
                  supportedTokens: chainConfig.supportedTokens,
                },
              ],
            ),
          ),
        };
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data) }],
      };
    },
  );
}
