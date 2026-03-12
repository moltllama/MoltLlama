"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Search } from "lucide-react";
import { FormatNumber } from "@/components/shared/format-number";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DexProtocol {
  name: string;
  slug: string;
  category: string;
  logo: string;
  chains: string[];
  total24h: number | null;
  total7d: number | null;
  total30d: number | null;
  totalAllTime: number | null;
  change_1d: number | null;
  change_7d: number | null;
  change_1m: number | null;
}

interface DexOverview {
  total24h: number | null;
  total7d: number | null;
  total30d: number | null;
  change_1d: number | null;
  change_7d: number | null;
  change_1m: number | null;
}

interface DexData {
  overview: DexOverview;
  protocols: DexProtocol[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHAIN_OPTIONS = ["All Chains", "Base", "Ethereum"] as const;
const PAGE_SIZE = 25;

// ---------------------------------------------------------------------------
// SWR fetcher
// ---------------------------------------------------------------------------

async function fetcher(url: string): Promise<DexData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const json = await res.json();
  // Unwrap MCP response envelope: { status, data: { overview, protocols }, meta }
  const payload = json.data ?? json;
  return {
    overview: payload.overview ?? {},
    protocols: payload.protocols ?? [],
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatChange(value: number | null): JSX.Element {
  if (value === null || value === undefined) return <span className="text-molt-text-muted">-</span>;
  const positive = value >= 0;
  return (
    <span className={positive ? "text-data-positive" : "text-data-negative"}>
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DexsClient() {
  const [chain, setChain] = useState<string>("All Chains");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);

  const chainParam = chain === "All Chains" ? "" : `?chain=${chain.toLowerCase()}`;

  const { data, isLoading, error } = useSWR<DexData>(
    `/api/mcp/dexs${chainParam}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  const filtered = useMemo(() => {
    if (!data?.protocols) return [];

    return data.protocols.filter((p) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [data, searchTerm]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold text-molt-text-primary mb-6">
        DEX Volumes
      </h1>

      {/* Overview cards */}
      {data?.overview && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4">
            <p className="text-xs text-molt-text-muted mb-1">24h Volume</p>
            <p className="text-lg font-bold text-molt-text-primary">
              {data.overview.total24h ? <FormatNumber value={data.overview.total24h} prefix="$" /> : "-"}
            </p>
            <p className="text-xs mt-1">{formatChange(data.overview.change_1d)}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-molt-text-muted mb-1">7d Volume</p>
            <p className="text-lg font-bold text-molt-text-primary">
              {data.overview.total7d ? <FormatNumber value={data.overview.total7d} prefix="$" /> : "-"}
            </p>
            <p className="text-xs mt-1">{formatChange(data.overview.change_7d)}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-molt-text-muted mb-1">30d Volume</p>
            <p className="text-lg font-bold text-molt-text-primary">
              {data.overview.total30d ? <FormatNumber value={data.overview.total30d} prefix="$" /> : "-"}
            </p>
            <p className="text-xs mt-1">{formatChange(data.overview.change_1m)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-molt-text-muted"
          />
          <input
            type="text"
            placeholder="Search DEX..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            className="w-56 rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light pl-8 pr-3 py-2 text-xs text-molt-text-primary placeholder:text-molt-text-muted focus:outline-none focus:border-molt-purple transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {CHAIN_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setChain(c);
                setPage(0);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                chain === c
                  ? "bg-molt-purple/20 border-molt-purple text-molt-purple"
                  : "bg-molt-bg-secondary border-molt-stroke-light text-molt-text-secondary hover:border-molt-text-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-molt-text-muted mb-3">
        {isLoading
          ? "Loading DEX volumes..."
          : error
            ? "Failed to load DEX data."
            : `${filtered.length} DEX${filtered.length !== 1 ? "es" : ""} found`}
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

      {/* Error */}
      {error && !isLoading && (
        <div className="glass-card p-8 text-center">
          <p className="text-data-negative text-sm">
            Unable to load DEX volume data.
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
                    DEX
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden md:table-cell">
                    Chains
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden sm:table-cell">
                    7d Volume
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden lg:table-cell">
                    30d Volume
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    24h Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((dex) => (
                  <tr key={dex.slug} className="table-row">
                    <td className="px-4 py-3">
                      <span className="font-medium text-molt-text-primary text-xs">
                        {dex.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {dex.chains.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center rounded-full bg-molt-bg-secondary px-2 py-0.5 text-[10px] font-medium text-molt-text-secondary"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-molt-text-primary text-xs">
                      {dex.total24h != null ? <FormatNumber value={dex.total24h} prefix="$" /> : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-molt-text-secondary text-xs hidden sm:table-cell">
                      {dex.total7d != null ? <FormatNumber value={dex.total7d} prefix="$" /> : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-molt-text-secondary text-xs hidden lg:table-cell">
                      {dex.total30d != null ? <FormatNumber value={dex.total30d} prefix="$" /> : "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs">
                      {formatChange(dex.change_1d)}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-molt-text-muted text-sm">
                      No DEXes match the current filters.
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
