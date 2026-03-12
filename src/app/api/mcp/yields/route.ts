import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";
import type { YieldPool } from "@/lib/defillama/types";

const VALID_SORT_FIELDS = ["apy", "tvl"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

/**
 * GET /api/mcp/yields
 *
 * Lists yield farming opportunities from DeFiLlama.
 *
 * Query params:
 *   chain      - Filter by chain slug (e.g. "base", "ethereum")
 *   protocol   - Filter by protocol slug (e.g. "aave-v3")
 *   minApy     - Minimum APY percentage
 *   stableOnly - Only include stablecoin pools ("true" / "false")
 *   limit      - Max results (default 100)
 *   sort       - Sort field: apy | tvl (default "apy")
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const chainParam = searchParams.get("chain")?.toLowerCase();
  const protocolParam = searchParams.get("protocol")?.toLowerCase();
  const minApyParam = searchParams.get("minApy");
  const stableOnlyParam = searchParams.get("stableOnly");
  const limitParam = searchParams.get("limit");
  const sortParam = searchParams.get("sort")?.toLowerCase();

  // Validate chain param
  if (chainParam) {
    const validChain = SUPPORTED_CHAINS.find((c) => c.slug === chainParam);
    if (!validChain) {
      return mcpError(
        `Unsupported chain "${chainParam}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
      );
    }
  }

  // Validate sort param
  const sort: SortField =
    sortParam && VALID_SORT_FIELDS.includes(sortParam as SortField)
      ? (sortParam as SortField)
      : "apy";

  const minApy = minApyParam ? parseFloat(minApyParam) : 0;
  if (minApyParam && isNaN(minApy)) {
    return mcpError("minApy must be a valid number");
  }

  const stableOnly = stableOnlyParam === "true";

  const limit = limitParam ? parseInt(limitParam, 10) : 100;
  if (limitParam && (isNaN(limit) || limit < 1)) {
    return mcpError("limit must be a positive integer");
  }

  // Fetch yield pools from DeFiLlama
  const pools = await dataProvider.getYieldPools();
  if (!pools) {
    return mcpError("Failed to fetch yield pools from DeFiLlama", 502);
  }

  // Build chain name mapping for filtering
  const chainNameMap = new Map(
    SUPPORTED_CHAINS.map((c) => [c.slug, c.defiLlamaName]),
  );

  // Determine which DeFiLlama chain names to include
  const targetChainNames: Set<string> = chainParam
    ? new Set([chainNameMap.get(chainParam)!])
    : new Set(SUPPORTED_CHAINS.map((c) => c.defiLlamaName));

  // Filter pools
  let filtered = pools.filter((pool) => {
    // Chain filter
    if (!targetChainNames.has(pool.chain)) return false;

    // Protocol filter
    if (protocolParam && pool.project.toLowerCase() !== protocolParam) return false;

    // APY filter
    if (pool.apy !== null && pool.apy < minApy) return false;
    if (pool.apy === null && minApy > 0) return false;

    // Stablecoin filter
    if (stableOnly && !pool.stablecoin) return false;

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

  return mcpResponse(
    { pools: data, total: data.length },
    {
      source: "defillama",
      ttl: CACHE_TTL.YIELD_POOLS,
      chain: chainParam,
    },
  );
}

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
