import { dataProvider } from "@/lib/providers";
import { getProtocol as getRegistryProtocol } from "@/data/protocols";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";

/**
 * GET /api/mcp/protocols/[slug]
 *
 * Returns detailed protocol information by merging DeFiLlama protocol data
 * with the local registry's contract metadata (addresses, key functions,
 * supported tokens).
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  if (!slug || typeof slug !== "string") {
    return mcpError("Protocol slug is required");
  }

  // Fetch protocol detail from DeFiLlama
  const protocolDetail = await dataProvider.getProtocol(slug);
  if (!protocolDetail) {
    return mcpError(`Protocol "${slug}" not found on DeFiLlama`, 404);
  }

  // Look up local registry data (may be null if protocol is not in registry)
  const registryData = getRegistryProtocol(slug);

  // Build current chain TVLs summary
  const currentChainTvls = protocolDetail.currentChainTvls ?? {};

  // Get TVL history (last 30 data points for a reasonable response size)
  const tvlHistory = protocolDetail.tvl
    ? protocolDetail.tvl.slice(-30)
    : [];

  // Build the merged response
  const data: Record<string, unknown> = {
    // Core identity
    slug: protocolDetail.slug,
    name: protocolDetail.name,
    category: protocolDetail.category,
    description: protocolDetail.description,
    url: protocolDetail.url,
    logo: protocolDetail.logo,
    symbol: protocolDetail.symbol,

    // On-chain data from DeFiLlama
    chains: protocolDetail.chains,
    currentChainTvls,
    tvlHistory,
    methodology: protocolDetail.methodology ?? null,
    mcap: protocolDetail.mcap ?? null,
    forkedFrom: protocolDetail.forkedFrom ?? null,
    auditLinks: protocolDetail.audit_links ?? null,
    raises: protocolDetail.raises ?? null,

    // Registry data (contract addresses, functions, supported tokens)
    registry: null as Record<string, unknown> | null,
  };

  if (registryData) {
    data.registry = {
      category: registryData.category,
      website: registryData.website,
      docs: registryData.docs ?? null,
      github: registryData.github ?? null,
      chains: Object.fromEntries(
        Object.entries(registryData.chains).map(([chainSlug, chainConfig]) => [
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
        ]),
      ),
    };
  }

  return mcpResponse(data, {
    source: registryData ? "defillama+registry" : "defillama",
    ttl: CACHE_TTL.PROTOCOL_DETAIL,
  });
}
