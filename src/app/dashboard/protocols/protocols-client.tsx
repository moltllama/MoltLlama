"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Search } from "lucide-react";
import { ProtocolTable, type ProtocolRow } from "@/components/dashboard/protocol-table";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types for the API response
// ---------------------------------------------------------------------------

interface ApiProtocol {
  slug: string;
  name: string;
  category: string;
  chains: string[];
  tvl: number;
  change_1d: number | null;
  change_7d: number | null;
  logo: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CHAIN_FILTERS = ["All Chains", "Base", "Ethereum"] as const;
const CATEGORY_FILTERS = [
  "All Categories",
  "Lending",
  "Dexes",
  "Liquid Staking",
  "Bridge",
  "CDP",
  "Derivatives",
  "Yield",
  "Yield Aggregator",
] as const;

const PAGE_SIZE = 25;

// ---------------------------------------------------------------------------
// SWR fetcher
// ---------------------------------------------------------------------------

async function fetcher(url: string): Promise<ApiProtocol[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const json = await res.json();
  // Unwrap MCP response envelope: { status, data: { protocols: [] }, meta }
  const payload = json.data ?? json;
  return Array.isArray(payload) ? payload : payload.protocols ?? [];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ProtocolsClient() {
  const [search, setSearch] = useState("");
  const [chainFilter, setChainFilter] = useState<string>("All Chains");
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");
  const [page, setPage] = useState(0);

  const { data: protocols, isLoading, error } = useSWR<ApiProtocol[]>(
    "/api/mcp/protocols",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  // Filtered + sorted list
  const filtered = useMemo(() => {
    if (!protocols) return [];

    return protocols
      .filter((p) => {
        // Search
        if (search) {
          const q = search.toLowerCase();
          if (
            !p.name.toLowerCase().includes(q) &&
            !p.slug.toLowerCase().includes(q) &&
            !p.category.toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        // Chain filter
        if (chainFilter !== "All Chains") {
          if (!p.chains.includes(chainFilter)) return false;
        }
        // Category filter
        if (categoryFilter !== "All Categories") {
          if (p.category.toLowerCase() !== categoryFilter.toLowerCase())
            return false;
        }
        return true;
      })
      .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0));
  }, [protocols, search, chainFilter, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged: ProtocolRow[] = filtered
    .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      chains: p.chains,
      tvl: p.tvl,
      change_1d: p.change_1d,
      change_7d: p.change_7d,
      logo: p.logo,
    }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-molt-text-primary mb-6">
        Protocols
      </h1>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-molt-text-muted"
        />
        <input
          type="text"
          placeholder="Search protocols..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="w-full rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light pl-9 pr-4 py-2.5 text-sm text-molt-text-primary placeholder:text-molt-text-muted focus:outline-none focus:border-molt-purple transition-colors"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CHAIN_FILTERS.map((chain) => (
          <button
            key={chain}
            type="button"
            onClick={() => {
              setChainFilter(chain);
              setPage(0);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
              chainFilter === chain
                ? "bg-molt-purple/20 border-molt-purple text-molt-purple"
                : "bg-molt-bg-secondary border-molt-stroke-light text-molt-text-secondary hover:border-molt-text-muted",
            )}
          >
            {chain}
          </button>
        ))}
        <span className="w-px h-6 bg-molt-stroke-light self-center mx-1" />
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setCategoryFilter(cat);
              setPage(0);
            }}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium border transition-colors",
              categoryFilter === cat
                ? "bg-molt-pink/20 border-molt-pink text-molt-pink"
                : "bg-molt-bg-secondary border-molt-stroke-light text-molt-text-secondary hover:border-molt-text-muted",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-molt-text-muted mb-3">
        {isLoading
          ? "Loading protocols..."
          : error
            ? "Failed to load protocols."
            : `${filtered.length} protocol${filtered.length !== 1 ? "s" : ""} found`}
      </p>

      {/* Loading state */}
      {isLoading && (
        <div className="glass-card p-8 animate-pulse">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-molt-bg-hover" />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="glass-card p-8 text-center">
          <p className="text-data-negative text-sm">
            Error loading protocols. The /api/mcp/protocols endpoint may not be
            available yet.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && <ProtocolTable protocols={paged} />}

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
