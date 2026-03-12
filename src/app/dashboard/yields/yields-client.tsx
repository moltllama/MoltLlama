"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Search, Filter } from "lucide-react";
import { FormatNumber } from "@/components/shared/format-number";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface YieldPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  stablecoin: boolean;
  ilRisk: string | null;
  exposure: string | null;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHAIN_OPTIONS = ["All Chains", "Base", "Ethereum"] as const;
const MIN_APY_OPTIONS = [0, 1, 5, 10, 20, 50] as const;
const PAGE_SIZE = 25;

// ---------------------------------------------------------------------------
// SWR fetcher
// ---------------------------------------------------------------------------

async function fetcher(url: string): Promise<YieldPool[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const json = await res.json();
  // Unwrap MCP response envelope: { status, data: { pools: [] }, meta }
  const payload = json.data ?? json;
  return Array.isArray(payload) ? payload : payload.pools ?? [];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatApy(value: number | null): string {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(2)}%`;
}

function RiskBadge({ risk }: { risk: string | null }) {
  if (!risk) return <span className="text-molt-text-muted text-xs">-</span>;

  const colorMap: Record<string, string> = {
    no: "text-data-positive",
    yes: "text-data-negative",
    low: "text-data-positive",
    medium: "text-molt-orange",
    high: "text-data-negative",
  };

  const color = colorMap[risk.toLowerCase()] ?? "text-molt-text-muted";
  return <span className={cn("text-xs font-medium capitalize", color)}>{risk}</span>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function YieldsClient() {
  const [chain, setChain] = useState<string>("All Chains");
  const [minApy, setMinApy] = useState<number>(0);
  const [stableOnly, setStableOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const { data: pools, isLoading, error } = useSWR<YieldPool[]>(
    "/api/mcp/yields",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  const filtered = useMemo(() => {
    if (!pools) return [];

    return pools
      .filter((p) => {
        if (chain !== "All Chains" && p.chain !== chain) return false;
        if (p.apy !== null && p.apy < minApy) return false;
        if (p.apy === null && minApy > 0) return false;
        if (stableOnly && !p.stablecoin) return false;
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          if (
            !p.symbol.toLowerCase().includes(q) &&
            !p.project.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (b.apy ?? 0) - (a.apy ?? 0));
  }, [pools, chain, minApy, stableOnly, searchTerm]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold text-molt-text-primary mb-6">
        Yield Explorer
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-molt-text-muted"
          />
          <input
            type="text"
            placeholder="Search pool or protocol..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-56 rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light pl-8 pr-3 py-2 text-xs text-molt-text-primary placeholder:text-molt-text-muted focus:outline-none focus:border-molt-purple transition-colors"
          />
        </div>

        {/* Chain filter */}
        <div className="flex items-center gap-1">
          <Filter size={14} className="text-molt-text-muted" />
          <select
            value={chain}
            onChange={(e) => {
              setChain(e.target.value);
              setPage(0);
            }}
            className="rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-3 py-2 text-xs text-molt-text-primary focus:outline-none focus:border-molt-purple transition-colors appearance-none cursor-pointer"
          >
            {CHAIN_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Min APY */}
        <select
          value={minApy}
          onChange={(e) => {
            setMinApy(Number(e.target.value));
            setPage(0);
          }}
          className="rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-3 py-2 text-xs text-molt-text-primary focus:outline-none focus:border-molt-purple transition-colors appearance-none cursor-pointer"
        >
          {MIN_APY_OPTIONS.map((v) => (
            <option key={v} value={v}>
              Min APY: {v}%
            </option>
          ))}
        </select>

        {/* Stablecoins only toggle */}
        <button
          type="button"
          onClick={() => {
            setStableOnly(!stableOnly);
            setPage(0);
          }}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
            stableOnly
              ? "bg-molt-purple/20 border-molt-purple text-molt-purple"
              : "bg-molt-bg-secondary border-molt-stroke-light text-molt-text-secondary hover:border-molt-text-muted",
          )}
        >
          Stablecoins Only
        </button>
      </div>

      {/* Results count */}
      <p className="text-xs text-molt-text-muted mb-3">
        {isLoading
          ? "Loading yield pools..."
          : error
            ? "Failed to load yields."
            : `${filtered.length} pool${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* Loading */}
      {isLoading && (
        <div className="glass-card p-8 animate-pulse">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-molt-bg-hover" />
            ))}
          </div>
        </div>
      )}

      {/* Error / unavailable */}
      {error && !isLoading && (
        <div className="glass-card p-8 text-center">
          <p className="text-data-negative text-sm mb-2">
            Unable to load yield data.
          </p>
          <p className="text-molt-text-muted text-xs">
            This may require a DeFiLlama API key. Check that the /api/mcp/yields
            endpoint is configured.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-molt-stroke-light">
                  <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    Pool
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden sm:table-cell">
                    Protocol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden md:table-cell">
                    Chain
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    Base APY
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden sm:table-cell">
                    Reward APY
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    Total APY
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden lg:table-cell">
                    TVL
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden lg:table-cell">
                    IL Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((pool) => (
                  <tr key={pool.pool} className="table-row">
                    <td className="px-4 py-3">
                      <span className="font-medium text-molt-text-primary text-xs">
                        {pool.symbol}
                      </span>
                      {pool.stablecoin && (
                        <span className="ml-1.5 inline-flex items-center rounded-full bg-data-positive/10 px-1.5 py-0.5 text-[10px] font-medium text-data-positive">
                          Stable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-molt-text-secondary text-xs hidden sm:table-cell capitalize">
                      {pool.project}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center rounded-full bg-molt-bg-secondary px-2 py-0.5 text-[10px] font-medium text-molt-text-secondary">
                        {pool.chain}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-molt-text-primary text-xs">
                      {formatApy(pool.apyBase)}
                    </td>
                    <td className="px-4 py-3 text-right text-molt-purple text-xs hidden sm:table-cell">
                      {formatApy(pool.apyReward)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-data-positive text-xs">
                      {formatApy(pool.apy)}
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <FormatNumber value={pool.tvlUsd} prefix="$" />
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <RiskBadge risk={pool.ilRisk} />
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-molt-text-muted text-sm">
                      No pools match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-4 py-2 text-xs font-medium text-molt-text-secondary hover:text-molt-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-molt-text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-4 py-2 text-xs font-medium text-molt-text-secondary hover:text-molt-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
