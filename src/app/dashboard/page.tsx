import type { Metadata } from "next";
import { Suspense } from "react";
import { DollarSign, BarChart3, Layers, TrendingUp } from "lucide-react";
import { dataProvider } from "@/lib/providers";
import { formatUsd } from "@/lib/utils/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { TvlChart, type TvlDataPoint } from "@/components/dashboard/tvl-chart";
import { ProtocolTable, type ProtocolRow } from "@/components/dashboard/protocol-table";

export const metadata: Metadata = {
  title: "Dashboard Overview",
  description:
    "Real-time DeFi protocol metrics, TVL charts, and top protocols for autonomous agents on Base and Ethereum.",
  alternates: { canonical: "/dashboard" },
};

// ---------------------------------------------------------------------------
// Data fetching helpers (server-side)
// ---------------------------------------------------------------------------

async function getOverviewStats() {
  const [protocols, dexVolumes, yieldPools, baseTvl, ethTvl] =
    await Promise.all([
      dataProvider.getProtocols(),
      dataProvider.getDexVolumes(),
      dataProvider.getYieldPools(),
      dataProvider.getChainTvl("Base"),
      dataProvider.getChainTvl("Ethereum"),
    ]);

  // Total TVL (Base + Ethereum latest)
  const baseTvlLatest = baseTvl?.at(-1)?.tvl ?? 0;
  const ethTvlLatest = ethTvl?.at(-1)?.tvl ?? 0;
  const totalTvl = baseTvlLatest + ethTvlLatest;

  // 24h DEX Volume
  const dexVolume24h = dexVolumes?.total24h ?? 0;

  // Tracked protocol count (filter to Base/Ethereum)
  const trackedProtocols =
    protocols?.filter(
      (p) =>
        p.chains.some((c) =>
          ["Base", "Ethereum"].includes(c),
        ),
    ) ?? [];

  // Top APY
  const relevantPools =
    yieldPools?.filter(
      (p) =>
        ["Base", "Ethereum"].includes(p.chain) &&
        p.apy !== null &&
        p.tvlUsd > 100_000,
    ) ?? [];
  const topApy = relevantPools.reduce(
    (max, p) => (p.apy !== null && p.apy > max ? p.apy : max),
    0,
  );

  // TVL chart data (last 30 days)
  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

  const baseLast30 = (baseTvl ?? []).filter((d) => d.date >= thirtyDaysAgo);
  const ethLast30 = (ethTvl ?? []).filter((d) => d.date >= thirtyDaysAgo);

  // Build a date -> values map
  const dateMap = new Map<string, { base: number; ethereum: number }>();

  for (const entry of baseLast30) {
    const dateStr = new Date(entry.date * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const existing = dateMap.get(dateStr) ?? { base: 0, ethereum: 0 };
    existing.base = entry.tvl;
    dateMap.set(dateStr, existing);
  }

  for (const entry of ethLast30) {
    const dateStr = new Date(entry.date * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const existing = dateMap.get(dateStr) ?? { base: 0, ethereum: 0 };
    existing.ethereum = entry.tvl;
    dateMap.set(dateStr, existing);
  }

  const chartData: TvlDataPoint[] = Array.from(dateMap.entries())
    .sort((a, b) => {
      // Sort by the first occurrence in the original data
      const dateA = new Date(a[0] + ", 2025").getTime();
      const dateB = new Date(b[0] + ", 2025").getTime();
      return dateA - dateB;
    })
    .map(([date, values]) => ({
      date,
      base: values.base,
      ethereum: values.ethereum,
    }));

  // Top 10 protocols by TVL on Base/Ethereum
  const top10: ProtocolRow[] = trackedProtocols
    .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
    .slice(0, 10)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      chains: p.chains.filter((c) => ["Base", "Ethereum"].includes(c)),
      tvl: p.tvl,
      change_1d: p.change_1d,
      change_7d: p.change_7d,
      logo: p.logo,
    }));

  return {
    totalTvl,
    dexVolume24h,
    protocolCount: trackedProtocols.length,
    topApy,
    chartData,
    top10,
  };
}

// ---------------------------------------------------------------------------
// Sub-components with loading states
// ---------------------------------------------------------------------------

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCard key={i} label="" value="" loading />
      ))}
    </div>
  );
}

async function DashboardStats() {
  const stats = await getOverviewStats();

  return (
    <>
      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total TVL"
          value={formatUsd(stats.totalTvl)}
          icon={DollarSign}
        />
        <StatCard
          label="24h DEX Volume"
          value={formatUsd(stats.dexVolume24h)}
          icon={BarChart3}
        />
        <StatCard
          label="Tracked Protocols"
          value={stats.protocolCount.toLocaleString()}
          icon={Layers}
        />
        <StatCard
          label="Top APY"
          value={`${stats.topApy.toFixed(2)}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Two-column grid */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TvlChart data={stats.chartData} />
        <div>
          <h2 className="text-sm font-semibold text-molt-text-primary mb-3">
            Top 10 Protocols
          </h2>
          <ProtocolTable protocols={stats.top10} />
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardOverviewPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-molt-text-primary mb-6">
        Dashboard Overview
      </h1>

      <Suspense fallback={<StatCardsSkeleton />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
