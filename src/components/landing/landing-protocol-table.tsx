import Link from "next/link";
import { dataProvider } from "@/lib/providers";
import {
  ProtocolTable,
  type ProtocolRow,
} from "@/components/dashboard/protocol-table";

export function LandingProtocolTableSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-molt-bg-hover" />
        ))}
      </div>
    </div>
  );
}

export async function LandingProtocolTable() {
  const protocols = await dataProvider.getProtocols();

  const tracked: ProtocolRow[] = (protocols ?? [])
    .filter((p) =>
      p.chains.some((c) => ["Base", "Ethereum"].includes(c)),
    )
    .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
    .slice(0, 15)
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

  return (
    <div>
      <ProtocolTable protocols={tracked} />
      <div className="mt-4 text-center">
        <Link
          href="/dashboard/protocols"
          className="text-sm text-molt-purple hover:text-molt-purple-light transition-colors"
        >
          View all protocols &rarr;
        </Link>
      </div>
    </div>
  );
}
