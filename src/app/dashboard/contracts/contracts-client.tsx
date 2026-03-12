"use client";

import { useState } from "react";
import useSWR from "swr";
import { FileCode, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FunctionInput {
  name: string;
  type: string;
  description: string;
}

interface KeyFunction {
  name: string;
  signature: string;
  selector: string;
  description: string;
  inputs: FunctionInput[];
  txPreparation: {
    requiresApproval: boolean;
    approvalTarget: string | null;
    gasEstimate: number;
    notes: string[];
  } | null;
}

interface Contract {
  name: string;
  address: string;
  purpose: string;
  explorerUrl: string;
  keyFunctions: KeyFunction[];
}

interface ChainContracts {
  contracts: Contract[];
  supportedTokens: string[];
}

interface ProtocolInfo {
  slug: string;
  name: string;
  category: string;
  description: string;
  website: string;
  docs: string | null;
  github: string | null;
}

interface ContractsData {
  protocol: ProtocolInfo;
  chains: Record<string, ChainContracts>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PROTOCOLS = [
  { slug: "aave-v3", name: "Aave V3" },
  { slug: "uniswap-v3", name: "Uniswap V3" },
  { slug: "compound-v3", name: "Compound V3" },
  { slug: "aerodrome", name: "Aerodrome" },
  { slug: "morpho", name: "Morpho" },
  { slug: "moonwell", name: "Moonwell" },
];

// ---------------------------------------------------------------------------
// SWR fetcher
// ---------------------------------------------------------------------------

async function fetcher(url: string): Promise<ContractsData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const json = await res.json();
  // Unwrap MCP response envelope: { status, data: { protocol, chains }, meta }
  const payload = json.data ?? json;
  return {
    protocol: payload.protocol,
    chains: payload.chains ?? {},
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ContractCard({ contract }: { contract: Contract }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-molt-stroke-light rounded-molt-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-molt-bg-hover/50 transition-colors"
      >
        <div className="flex items-center gap-3 text-left">
          <FileCode size={16} className="text-molt-purple shrink-0" />
          <div>
            <p className="text-sm font-medium text-molt-text-primary">{contract.name}</p>
            <p className="text-xs text-molt-text-muted font-mono">{contract.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={contract.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-molt-purple hover:text-molt-purple-light transition-colors"
          >
            <ExternalLink size={14} />
          </a>
          {expanded ? (
            <ChevronDown size={16} className="text-molt-text-muted" />
          ) : (
            <ChevronRight size={16} className="text-molt-text-muted" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-molt-stroke-light">
          <p className="text-xs text-molt-text-secondary mt-3 mb-3">{contract.purpose}</p>
          {contract.keyFunctions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                Key Functions
              </p>
              {contract.keyFunctions.map((fn) => (
                <div key={fn.selector} className="bg-molt-bg-secondary rounded-molt-sm p-3">
                  <p className="text-xs font-mono text-molt-purple mb-1">{fn.signature}</p>
                  <p className="text-xs text-molt-text-secondary">{fn.description}</p>
                  {fn.inputs.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {fn.inputs.map((input) => (
                        <div key={input.name} className="flex gap-2 text-[11px]">
                          <span className="font-mono text-molt-text-muted">{input.type}</span>
                          <span className="font-mono text-molt-text-primary">{input.name}</span>
                          <span className="text-molt-text-muted">— {input.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ContractsClient() {
  const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOLS[0].slug);

  const { data, isLoading, error } = useSWR<ContractsData>(
    `/api/mcp/contracts?protocol=${selectedProtocol}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    },
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-molt-text-primary mb-6">
        Contract Explorer
      </h1>

      {/* Protocol selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PROTOCOLS.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSelectedProtocol(p.slug)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium border transition-colors",
              selectedProtocol === p.slug
                ? "bg-molt-purple/20 border-molt-purple text-molt-purple"
                : "bg-molt-bg-secondary border-molt-stroke-light text-molt-text-secondary hover:border-molt-text-muted",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="glass-card p-8 animate-pulse">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded bg-molt-bg-hover" />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="glass-card p-8 text-center">
          <p className="text-data-negative text-sm">
            Unable to load contract data for this protocol.
          </p>
        </div>
      )}

      {/* Protocol info + contracts */}
      {!isLoading && !error && data && (
        <div>
          {/* Protocol header */}
          <div className="glass-card p-4 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-molt-text-primary">{data.protocol.name}</h2>
                <p className="text-xs text-molt-text-secondary mt-1">{data.protocol.description}</p>
                <span className="inline-flex items-center rounded-full bg-molt-bg-secondary px-2 py-0.5 text-[10px] font-medium text-molt-text-muted mt-2 capitalize">
                  {data.protocol.category}
                </span>
              </div>
              <div className="flex gap-2">
                <a
                  href={data.protocol.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-molt-purple hover:text-molt-purple-light transition-colors"
                >
                  Website
                </a>
                {data.protocol.docs && (
                  <a
                    href={data.protocol.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-molt-purple hover:text-molt-purple-light transition-colors"
                  >
                    Docs
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Chain sections */}
          {Object.entries(data.chains).map(([chainSlug, chainData]) => (
            <div key={chainSlug} className="mb-6">
              <h3 className="text-sm font-semibold text-molt-text-primary mb-3 capitalize">
                {chainSlug}
              </h3>

              {/* Supported tokens */}
              {chainData.supportedTokens.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs text-molt-text-muted mr-1">Tokens:</span>
                  {chainData.supportedTokens.map((token) => (
                    <span
                      key={token}
                      className="inline-flex items-center rounded-full bg-molt-bg-secondary px-2 py-0.5 text-[10px] font-medium text-molt-text-secondary"
                    >
                      {token}
                    </span>
                  ))}
                </div>
              )}

              {/* Contracts */}
              <div className="space-y-2">
                {chainData.contracts.map((contract) => (
                  <ContractCard key={contract.address} contract={contract} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
