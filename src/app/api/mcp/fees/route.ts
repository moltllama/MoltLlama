import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";

/**
 * GET /api/mcp/fees
 *
 * Returns protocol fee and revenue overview from DeFiLlama,
 * optionally filtered by chain.
 *
 * Query params:
 *   chain - Filter by chain slug (e.g. "base", "ethereum")
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chainParam = searchParams.get("chain")?.toLowerCase();

  // Validate chain param
  let resolvedChain: string | undefined;
  if (chainParam) {
    const chainConfig = SUPPORTED_CHAINS.find((c) => c.slug === chainParam);
    if (!chainConfig) {
      return mcpError(
        `Unsupported chain "${chainParam}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
      );
    }
    resolvedChain = chainConfig.defiLlamaName;
  }

  // Fetch fee data from DeFiLlama
  const feeData = await dataProvider.getFees(resolvedChain);
  if (!feeData) {
    return mcpError("Failed to fetch fee data from DeFiLlama", 502);
  }

  // Build supported chain names for filtering
  const supportedChainNames = new Set(
    SUPPORTED_CHAINS.map((c) => c.defiLlamaName),
  );

  // Filter and shape protocol fee data
  const filteredProtocols = feeData.protocols
    .filter((p) => {
      if (chainParam) return true; // Already filtered by DeFiLlama
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
    chart: feeData.totalDataChart.slice(-30), // Last 30 data points
  };

  return mcpResponse(data, {
    source: "defillama",
    ttl: CACHE_TTL.FEES,
    chain: chainParam,
  });
}
