import Link from "next/link";
import { FormatNumber } from "@/components/shared/format-number";
import { PercentChange } from "@/components/shared/percent-change";

export interface ProtocolRow {
  slug: string;
  name: string;
  category: string;
  chains: string[];
  tvl: number;
  change_1d: number | null;
  change_7d: number | null;
  logo: string;
}

interface ProtocolTableProps {
  protocols: ProtocolRow[];
  /** Whether to show the rank column (defaults to true) */
  showRank?: boolean;
}

function ChainBadge({ chain }: { chain: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-molt-bg-secondary px-2 py-0.5 text-[10px] font-medium text-molt-text-secondary">
      {chain}
    </span>
  );
}

export function ProtocolTable({ protocols, showRank = true }: ProtocolTableProps) {
  if (!protocols.length) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-molt-text-muted text-sm">No protocols found</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-molt-stroke-light">
              {showRank && (
                <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                  #
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden sm:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden md:table-cell">
                Chain(s)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                TVL
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden sm:table-cell">
                1d Change
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider hidden lg:table-cell">
                7d Change
              </th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((protocol, idx) => (
              <tr key={protocol.slug} className="table-row">
                {showRank && (
                  <td className="px-4 py-3 text-molt-text-muted">
                    {idx + 1}
                  </td>
                )}
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/protocols/${protocol.slug}`}
                    className="flex items-center gap-2 hover:text-molt-pink transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={protocol.logo}
                      alt={protocol.name}
                      className="h-6 w-6 rounded-full bg-molt-bg-secondary"
                      loading="lazy"
                    />
                    <span className="font-medium text-molt-text-primary">
                      {protocol.name}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-molt-text-secondary hidden sm:table-cell">
                  {protocol.category}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {protocol.chains.slice(0, 3).map((chain) => (
                      <ChainBadge key={chain} chain={chain} />
                    ))}
                    {protocol.chains.length > 3 && (
                      <span className="text-[10px] text-molt-text-muted">
                        +{protocol.chains.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <FormatNumber value={protocol.tvl} prefix="$" />
                </td>
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  {protocol.change_1d !== null ? (
                    <PercentChange value={protocol.change_1d} />
                  ) : (
                    <span className="text-molt-text-muted">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right hidden lg:table-cell">
                  {protocol.change_7d !== null ? (
                    <PercentChange value={protocol.change_7d} />
                  ) : (
                    <span className="text-molt-text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
