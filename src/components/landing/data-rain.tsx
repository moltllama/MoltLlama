import { dataProvider } from "@/lib/providers";
import { formatUsd, formatPercent } from "@/lib/utils/format";
import { DataRainClient } from "./data-rain-client";

async function getMatrixData(): Promise<string[]> {
  const [protocols, yieldPools] = await Promise.all([
    dataProvider.getProtocols(),
    dataProvider.getYieldPools(),
  ]);

  const items: string[] = [];

  // Protocol entries — filter to Base/Ethereum, top 80 by TVL
  const tracked = (protocols ?? [])
    .filter((p) => p.chains.some((c) => ["Base", "Ethereum"].includes(c)))
    .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
    .slice(0, 80);

  for (const p of tracked) {
    items.push(`${p.name} \u00B7 ${formatUsd(p.tvl)} TVL`);
    if (p.change_1d !== null) {
      items.push(`${p.name} \u00B7 ${formatPercent(p.change_1d)} 24h`);
    }
    const chains = p.chains
      .filter((c) => ["Base", "Ethereum"].includes(c))
      .join(" \u00B7 ");
    items.push(`${p.category} \u00B7 ${chains}`);
  }

  // Yield pool entries — filter to Base/Ethereum, top 60 by TVL
  const pools = (yieldPools ?? [])
    .filter((y) => ["Base", "Ethereum"].includes(y.chain))
    .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0))
    .slice(0, 60);

  for (const y of pools) {
    if (y.apy !== null) {
      items.push(`${y.symbol} \u00B7 ${y.apy.toFixed(2)}% APY`);
    }
    if (y.tvlUsd > 0) {
      items.push(`${y.symbol} \u00B7 ${formatUsd(y.tvlUsd)} \u00B7 ${y.chain}`);
    }
    items.push(`${y.project} \u00B7 ${y.symbol} \u00B7 ${y.chain}`);
  }

  return items;
}

export function DataRainSkeleton() {
  return (
    <div className="flex flex-col gap-1 h-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex-1 rounded-sm bg-molt-bg-secondary/20 animate-pulse" />
      ))}
    </div>
  );
}

export async function DataRain() {
  const items = await getMatrixData();
  return <DataRainClient items={items} />;
}
