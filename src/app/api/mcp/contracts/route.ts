import { getProtocol } from "@/data/protocols";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { getAllProtocolSlugs } from "@/data/protocols";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";

/**
 * GET /api/mcp/contracts
 *
 * Returns contract addresses, key functions, and ABI info from the
 * protocol registry. This endpoint only uses local registry data
 * (no DeFiLlama calls).
 *
 * Query params:
 *   protocol - Required. Protocol slug (e.g. "aave-v3", "uniswap")
 *   chain    - Optional. Filter contracts to a specific chain slug
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const protocolSlug = searchParams.get("protocol")?.toLowerCase();
  const chainParam = searchParams.get("chain")?.toLowerCase();

  if (!protocolSlug) {
    return mcpError(
      `'protocol' query parameter is required. Available protocols: ${getAllProtocolSlugs().join(", ")}`,
    );
  }

  // Validate chain param
  if (chainParam) {
    const validChain = SUPPORTED_CHAINS.find((c) => c.slug === chainParam);
    if (!validChain) {
      return mcpError(
        `Unsupported chain "${chainParam}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
      );
    }
  }

  // Look up protocol in registry
  const protocol = getProtocol(protocolSlug);
  if (!protocol) {
    return mcpError(
      `Protocol "${protocolSlug}" not found in registry. Available protocols: ${getAllProtocolSlugs().join(", ")}`,
      404,
    );
  }

  // Filter chains if chain param provided
  const chainEntries = chainParam
    ? Object.entries(protocol.chains).filter(([slug]) => slug === chainParam)
    : Object.entries(protocol.chains);

  if (chainEntries.length === 0) {
    return mcpError(
      `Protocol "${protocolSlug}" has no contracts on chain "${chainParam}". ` +
      `Available chains for this protocol: ${Object.keys(protocol.chains).join(", ")}`,
      404,
    );
  }

  // Build response
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

  return mcpResponse(data, {
    source: "registry",
    ttl: CACHE_TTL.CONTRACTS,
    chain: chainParam,
  });
}
