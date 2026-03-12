import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getProtocol, getAllProtocolSlugs } from "@/data/protocols";
import { SUPPORTED_CHAINS } from "@/lib/constants";

export function registerGetContracts(server: McpServer) {
  server.tool(
    "get_contracts",
    "Get contract addresses, key functions, and ABI info from the protocol registry. Returns contract metadata including function signatures, selectors, inputs, and transaction preparation details.",
    {
      protocol: z
        .string()
        .describe(
          `Protocol slug (e.g. 'aave-v3'). Available: ${getAllProtocolSlugs().join(", ")}`,
        ),
      chain: z
        .string()
        .optional()
        .describe("Filter contracts to a specific chain slug"),
    },
    async ({ protocol: protocolSlug, chain }) => {
      const slug = protocolSlug.toLowerCase();
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

      const protocol = getProtocol(slug);
      if (!protocol) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Protocol "${slug}" not found in registry. Available protocols: ${getAllProtocolSlugs().join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      const chainEntries = chainParam
        ? Object.entries(protocol.chains).filter(
            ([s]) => s === chainParam,
          )
        : Object.entries(protocol.chains);

      if (chainEntries.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Protocol "${slug}" has no contracts on chain "${chainParam}". Available chains for this protocol: ${Object.keys(protocol.chains).join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      const chains: Record<string, unknown> = {};

      for (const [chainSlug, chainConfig] of chainEntries) {
        chains[chainSlug] = {
          contracts: chainConfig.contracts.map((contract) => ({
            name: contract.name,
            address: contract.address,
            purpose: contract.purpose,
            explorerUrl: contract.explorerUrl,
            keyFunctions: contract.keyFunctions.map((fn) => ({
              name: fn.name,
              signature: fn.signature,
              selector: fn.selector,
              description: fn.description,
              inputs: fn.inputs.map((input) => ({
                name: input.name,
                type: input.type,
                description: input.description,
              })),
              txPreparation: fn.txPreparation
                ? {
                    requiresApproval: fn.txPreparation.requiresApproval,
                    approvalTarget: fn.txPreparation.approvalTarget ?? null,
                    gasEstimate: fn.txPreparation.gasEstimate,
                    notes: fn.txPreparation.notes,
                  }
                : null,
            })),
          })),
          supportedTokens: chainConfig.supportedTokens,
        };
      }

      const data = {
        protocol: {
          slug: protocol.slug,
          name: protocol.name,
          category: protocol.category,
          description: protocol.description,
          website: protocol.website,
          docs: protocol.docs ?? null,
          github: protocol.github ?? null,
        },
        chains,
      };

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data) }],
      };
    },
  );
}
