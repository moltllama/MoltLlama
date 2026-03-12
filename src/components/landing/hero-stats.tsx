import { dataProvider } from "@/lib/providers";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { formatUsd } from "@/lib/utils/format";

async function getHeroData() {
  const [protocols, baseTvl, ethTvl] = await Promise.all([
    dataProvider.getProtocols(),
    dataProvider.getChainTvl("Base"),
    dataProvider.getChainTvl("Ethereum"),
  ]);

  const trackedProtocols =
    protocols?.filter((p) =>
      p.chains.some((c) => ["Base", "Ethereum"].includes(c)),
    ) ?? [];

  const totalTvl =
    (baseTvl?.at(-1)?.tvl ?? 0) + (ethTvl?.at(-1)?.tvl ?? 0);

  return {
    totalTvl,
    protocolCount: trackedProtocols.length,
    chainCount: SUPPORTED_CHAINS.length,
  };
}

export function HeroStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-card px-6 py-5 animate-pulse">
          <div className="h-8 w-24 rounded bg-molt-bg-hover mx-auto" />
          <div className="mt-2 h-4 w-16 rounded bg-molt-bg-hover mx-auto" />
        </div>
      ))}
    </div>
  );
}

export async function HeroStats() {
  const stats = await getHeroData();

  const items = [
    { value: formatUsd(stats.totalTvl), label: "TVL Tracked" },
    { value: stats.protocolCount.toLocaleString(), label: "Protocols" },
    { value: stats.chainCount.toString(), label: "Chains" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="glass-card px-6 py-5 text-center animate-fade-in-up"
        >
          <p className="text-3xl font-bold text-molt-pink">{stat.value}</p>
          <p className="mt-1 text-sm text-molt-text-secondary">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
