import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";
import type { DefiLlamaProtocol } from "@/lib/defillama/types";

const VALID_SORT_FIELDS = ["tvl", "change_1d", "change_7d"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

/**
 * GET /api/mcp/protocols
 *
 * Lists DeFi protocols with TVL, category, and change metrics.
 * Filters to supported chains (Base + Ethereum) by default.
 *
 * Query params:
 *   chain    - Filter by chain slug (e.g. "base", "ethereum")
 *   category - Filter by protocol category (e.g. "lending", "dex")
 *   minTvl   - Minimum TVL in USD
 *   limit    - Max results (default 100)
 *   sort     - Sort field: tvl | change_1d | change_7d (default "tvl")
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const chainFilter = searchParams.get("chain")?.toLowerCase();
  const categoryFilter = searchParams.get("category")?.toLowerCase();
  const minTvlParam = searchParams.get("minTvl");
  const limitParam = searchParams.get("limit");
  const sortParam = searchParams.get("sort")?.toLowerCase();

  // Validate chain param
  if (chainFilter) {
    const validChain = SUPPORTED_CHAINS.find((c) => c.slug === chainFilter);
    if (!validChain) {
      return mcpError(
        `Unsupported chain "${chainFilter}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
      );
    }
  }

  // Validate sort param
  const sort: SortField =
    sortParam && VALID_SORT_FIELDS.includes(sortParam as SortField)
      ? (sortParam as SortField)
      : "tvl";

  const minTvl = minTvlParam ? parseFloat(minTvlParam) : 0;
  if (minTvlParam && isNaN(minTvl)) {
    return mcpError("minTvl must be a valid number");
  }

  const limit = limitParam ? parseInt(limitParam, 10) : 100;
  if (limitParam && (isNaN(limit) || limit < 1)) {
    return mcpError("limit must be a positive integer");
  }

  // Fetch all protocols from DeFiLlama
  const protocols = await dataProvider.getProtocols();
  if (!protocols) {
    return mcpError("Failed to fetch protocols from DeFiLlama", 502);
  }

  // Build a set of DeFiLlama chain names to filter on
  const targetChains = chainFilter
    ? [SUPPORTED_CHAINS.find((c) => c.slug === chainFilter)!.defiLlamaName]
    : SUPPORTED_CHAINS.map((c) => c.defiLlamaName);

  // Filter protocols
  let filtered = protocols.filter((p) => {
    // Must be present on at least one target chain
    const onTargetChain = p.chains.some((c) => targetChains.includes(c));
    if (!onTargetChain) return false;

    // Category filter
    if (categoryFilter && p.category.toLowerCase() !== categoryFilter) return false;

    // TVL filter
    if (p.tvl < minTvl) return false;

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    const valA = getSortValue(a, sort);
    const valB = getSortValue(b, sort);
    return valB - valA; // Descending
  });

  // Limit
  filtered = filtered.slice(0, Math.min(limit, 500));

  // Shape the output
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
      Object.entries(p.chainTvls).filter(([chain]) => targetChains.includes(chain)),
    ),
    logo: p.logo,
    symbol: p.symbol,
    mcap: p.mcap ?? null,
    fdv: p.fdv ?? null,
    staking: p.staking ?? null,
    url: p.url,
  }));

  return mcpResponse(
    { protocols: data, total: data.length },
    { source: "defillama", ttl: CACHE_TTL.PROTOCOLS, chain: chainFilter },
  );
}

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
