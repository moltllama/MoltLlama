import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { getChainConfig } from "@/data/chains";
import { mcpResponse, mcpError } from "@/lib/mcp/helpers";
import { CACHE_TTL } from "@/lib/cache/ttl";

/**
 * GET /api/mcp/chains/[chain]
 *
 * Returns chain overview including TVL history, current TVL, and top protocols.
 */
export async function GET(
  request: Request,
  { params }: { params: { chain: string } },
) {
  const { chain } = params;

  if (!chain || typeof chain !== "string") {
    return mcpError("Chain slug is required");
  }

  const chainSlug = chain.toLowerCase();
  const chainConfig = getChainConfig(chainSlug);

  if (!chainConfig) {
    return mcpError(
      `Unsupported chain "${chainSlug}". Supported chains: ${SUPPORTED_CHAINS.map((c) => c.slug).join(", ")}`,
      404,
    );
  }

  // Fetch chain TVL history and all protocols in parallel
  const [tvlHistory, allProtocols] = await Promise.all([
    dataProvider.getChainTvl(chainConfig.defiLlamaName),
    dataProvider.getProtocols(),
  ]);

  if (!tvlHistory) {
    return mcpError(`Failed to fetch TVL data for chain "${chainSlug}"`, 502);
  }

  // Current TVL is the last entry in the history
  const currentTvl = tvlHistory.length > 0
    ? tvlHistory[tvlHistory.length - 1].tvl
    : 0;

  // Get TVL from 24h ago and 7d ago for change calculations
  const oneDayAgo = tvlHistory.length > 1 ? tvlHistory[tvlHistory.length - 2].tvl : currentTvl;
  const sevenDaysAgo = tvlHistory.length > 7 ? tvlHistory[tvlHistory.length - 8].tvl : currentTvl;

  const change1d = oneDayAgo > 0 ? ((currentTvl - oneDayAgo) / oneDayAgo) * 100 : 0;
  const change7d = sevenDaysAgo > 0 ? ((currentTvl - sevenDaysAgo) / sevenDaysAgo) * 100 : 0;

  // Filter and rank top protocols on this chain
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

  // Return last 90 days of TVL history to keep response size reasonable
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
      ? allProtocols.filter((p) => p.chains.includes(chainConfig.defiLlamaName)).length
      : 0,
  };

  return mcpResponse(data, {
    source: "defillama",
    ttl: CACHE_TTL.CHAIN_TVL,
    chain: chainSlug,
  });
}
