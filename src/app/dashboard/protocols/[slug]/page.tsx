import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, FileCode, ArrowLeft } from "lucide-react";
import { dataProvider } from "@/lib/providers";
import { getRegistryProtocol } from "@/data/protocols/registry";
import { formatUsd } from "@/lib/utils/format";
import { StatCard } from "@/components/dashboard/stat-card";
import { FormatNumber } from "@/components/shared/format-number";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PageProps {
  params: { slug: string };
}

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;
  const llamaData = await dataProvider.getProtocol(slug);

  if (!llamaData) {
    return {
      title: "Protocol Not Found",
      description: "The requested protocol could not be found.",
    };
  }

  const title = `${llamaData.name} - Protocol Details`;
  const description = llamaData.description
    ? `${llamaData.description.slice(0, 150)}...`
    : `View TVL, chain breakdown, and contract data for ${llamaData.name} on MoltLlama.`;

  return {
    title,
    description,
    alternates: { canonical: `/dashboard/protocols/${slug}` },
    openGraph: {
      title: `${llamaData.name} | MoltLlama`,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: `${llamaData.name} | MoltLlama`,
      description,
    },
  };
}

// ---------------------------------------------------------------------------
// Page (Server Component)
// ---------------------------------------------------------------------------

export default async function ProtocolDetailPage({ params }: PageProps) {
  const { slug } = params;

  // Fetch both DeFiLlama data and local registry data in parallel
  const [llamaData, registryData] = await Promise.all([
    dataProvider.getProtocol(slug),
    Promise.resolve(getRegistryProtocol(slug)),
  ]);

  if (!llamaData) {
    notFound();
  }

  // Compute current total TVL
  const currentChainTvls = llamaData.currentChainTvls ?? {};
  const totalTvl = Object.entries(currentChainTvls)
    .filter(([key]) => !key.includes("-"))
    .reduce((sum, [, val]) => sum + val, 0);

  // Sort chains by TVL descending
  const chainBreakdown = Object.entries(currentChainTvls)
    .filter(([key]) => !key.includes("-"))
    .sort(([, a], [, b]) => b - a);

  // Protocol logo
  const logoUrl =
    registryData?.logo ?? llamaData.logo ?? `https://icons.llama.fi/${slug}.png`;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/dashboard/protocols"
        className="inline-flex items-center gap-1.5 text-xs text-molt-text-muted hover:text-molt-text-secondary transition-colors mb-4"
      >
        <ArrowLeft size={14} />
        Back to Protocols
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={llamaData.name}
          loading="eager"
          className="h-14 w-14 rounded-full bg-molt-bg-secondary border border-molt-stroke-light"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-molt-text-primary">
              {llamaData.name}
            </h1>
            <span className="inline-flex items-center rounded-full bg-molt-purple/15 px-3 py-0.5 text-xs font-medium text-molt-purple">
              {llamaData.category}
            </span>
          </div>
          {llamaData.description && (
            <p className="mt-1 text-sm text-molt-text-secondary max-w-2xl leading-relaxed">
              {llamaData.description}
            </p>
          )}
        </div>
        {/* External links */}
        <div className="flex items-center gap-2">
          {llamaData.url && (
            <a
              href={llamaData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-3 py-2 text-xs text-molt-text-secondary hover:text-molt-text-primary transition-colors"
            >
              <ExternalLink size={12} />
              Website
            </a>
          )}
          {registryData?.docs && (
            <a
              href={registryData.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-3 py-2 text-xs text-molt-text-secondary hover:text-molt-text-primary transition-colors"
            >
              <ExternalLink size={12} />
              Docs
            </a>
          )}
          {registryData?.github && (
            <a
              href={registryData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-3 py-2 text-xs text-molt-text-secondary hover:text-molt-text-primary transition-colors"
            >
              <ExternalLink size={12} />
              GitHub
            </a>
          )}
        </div>
      </div>

      {/* TVL stat card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total TVL" value={formatUsd(totalTvl)} />
        <StatCard
          label="Chains"
          value={llamaData.chains?.length?.toString() ?? "0"}
        />
        {llamaData.mcap ? (
          <StatCard label="Market Cap" value={formatUsd(llamaData.mcap)} />
        ) : (
          <StatCard label="Symbol" value={llamaData.symbol ?? "-"} />
        )}
      </div>

      {/* Chain breakdown table */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-molt-text-primary mb-3">
          TVL by Chain
        </h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-molt-stroke-light">
                  <th className="px-4 py-3 text-left text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    Chain
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    TVL
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-molt-text-muted uppercase tracking-wider">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {chainBreakdown.map(([chain, tvl]) => (
                  <tr key={chain} className="table-row">
                    <td className="px-4 py-3">
                      <span className="font-medium text-molt-text-primary">
                        {chain}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <FormatNumber value={tvl} prefix="$" />
                    </td>
                    <td className="px-4 py-3 text-right text-molt-text-secondary">
                      {totalTvl > 0
                        ? `${((tvl / totalTvl) * 100).toFixed(1)}%`
                        : "-"}
                    </td>
                  </tr>
                ))}
                {chainBreakdown.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-molt-text-muted text-sm"
                    >
                      No chain breakdown available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Contract registry section (if in local registry) */}
      {registryData && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FileCode size={16} className="text-molt-purple" />
            <h2 className="text-sm font-semibold text-molt-text-primary">
              Contract Registry
            </h2>
          </div>

          {Object.entries(registryData.chains).map(([chainName, chainConfig]) => (
            <div key={chainName} className="mb-6 last:mb-0">
              <h3 className="text-xs font-medium text-molt-text-secondary uppercase tracking-wider mb-2">
                {chainName}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {chainConfig.contracts.map((contract) => (
                  <div key={contract.address} className="glass-card p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm text-molt-text-primary">
                        {contract.name}
                      </h4>
                      <a
                        href={contract.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-molt-purple hover:text-molt-purple-light transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <p className="text-xs text-molt-text-secondary mb-2 leading-relaxed">
                      {contract.purpose}
                    </p>
                    <div className="bg-molt-bg-tertiary rounded-molt-sm px-3 py-2 mb-3">
                      <code className="font-mono text-xs text-molt-green break-all">
                        {contract.address}
                      </code>
                    </div>
                    {contract.keyFunctions.length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-molt-text-muted uppercase tracking-wider mb-1.5">
                          Key Functions
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {contract.keyFunctions.map((fn) => (
                            <span
                              key={fn.selector}
                              className="inline-flex items-center rounded bg-molt-bg-secondary px-2 py-0.5 font-mono text-[10px] text-molt-purple"
                            >
                              {fn.name}()
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MCP endpoint link */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-molt-text-primary">MCP API Endpoint</p>
          <code className="text-xs font-mono text-molt-text-secondary">
            GET /api/mcp/protocols/{slug}
          </code>
        </div>
        <Link
          href={`/api/mcp/protocols/${slug}`}
          className="rounded-molt-sm bg-molt-bg-secondary border border-molt-stroke-light px-3 py-2 text-xs text-molt-text-secondary hover:text-molt-text-primary transition-colors"
        >
          View JSON
        </Link>
      </div>
    </div>
  );
}
