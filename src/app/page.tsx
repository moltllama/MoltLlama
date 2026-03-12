import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FAQ_ITEMS } from "@/data/faq";
import { DataRain, DataRainSkeleton } from "@/components/landing/data-rain";
import { McpInstallSnippet } from "@/components/landing/mcp-install-snippet";
import { HeroConnector } from "@/components/landing/hero-connector";
import { CapabilitiesGrid } from "@/components/landing/capabilities-grid";
import { DataConnector } from "@/components/landing/data-connector";
import { ExamplePrompts } from "@/components/landing/example-prompts";
import { FaqSection } from "@/components/landing/faq-section";
import { TrustBadges } from "@/components/landing/trust-badges";
import {
  LandingProtocolTable,
  LandingProtocolTableSkeleton,
} from "@/components/landing/landing-protocol-table";

const CHAIN_WIDGETS = [
  { name: "Ethereum", abbr: "ETH", color: "#627EEA", icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum" },
  { name: "Avalanche", abbr: "AVAX", color: "#E84142", icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche" },
  { name: "Base", abbr: "BASE", color: "#0052FF", icon: "https://icons.llamao.fi/icons/chains/rsz_base" },
  { name: "Arbitrum", abbr: "ARB", color: "#28A0F0", icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum" },
  { name: "Solana", abbr: "SOL", color: "#9945FF", icon: "https://icons.llamao.fi/icons/chains/rsz_solana" },
  { name: "BSC", abbr: "BNB", color: "#F0B90B", icon: "https://icons.llamao.fi/icons/chains/rsz_binance" },
  { name: "Polygon", abbr: "POL", color: "#8247E5", icon: "https://icons.llamao.fi/icons/chains/rsz_polygon" },
];

const FIRE_CLASSES = [
  "animate-chain-fire-1",
  "animate-chain-fire-2",
  "animate-chain-fire-3",
  "animate-chain-fire-4",
  "animate-chain-fire-5",
  "animate-chain-fire-6",
  "animate-chain-fire-7",
];

const sampleJson = `{
  "status": "ok",
  "data": {
    "protocols": [
      {
        "name": "Aave V3",
        "tvl": 12450000000,
        "change_1d": 2.34,
        "category": "Lending",
        "chains": ["Ethereum", "Base"]
      }
    ]
  },
  "meta": {
    "source": "defillama",
    "version": "1.0.0"
  }
}`;

export const metadata: Metadata = {
  title: "MoltLlama - DeFi Data for Task-Executing Agents",
  description:
    "Protocol metrics, yield data, and contract interfaces for AI agents that create LP positions, manage borrowing, and rebalance portfolios on Base and Ethereum.",
  keywords: [
    "DeFi",
    "MCP",
    "Model Context Protocol",
    "AI agents",
    "Base",
    "Ethereum",
    "TVL",
    "yield farming",
    "DEX volumes",
    "smart contracts",
  ],
  alternates: { canonical: "/" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* ====== Hero Section ====== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-molt-hero pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-center mb-10 lg:mb-14">
              <span className="text-4xl sm:text-5xl lg:text-6xl">🦞</span>{" "}
              <span className="bg-molt-accent bg-clip-text text-transparent">
                DeFi Data for Agents
              </span>
            </h1>

            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-0">
              {/* LEFT: Chain widgets (vertical) + Matrix data rows */}
              <div className="w-full lg:flex-1 flex gap-1 h-[460px] min-w-0 overflow-hidden">
                {/* Vertical chain widget column */}
                <div className="flex flex-col gap-1 shrink-0 w-10">
                  {CHAIN_WIDGETS.map((chain, i) => (
                    <div
                      key={chain.name}
                      className={`flex-1 flex items-center justify-center rounded-lg bg-molt-bg-card/60 backdrop-blur-sm border border-molt-stroke-light ${FIRE_CLASSES[i]}`}
                    >
                      <div
                        className="w-6 h-6 rounded-full overflow-hidden shrink-0"
                        style={{ backgroundColor: chain.color }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={chain.icon}
                          alt={chain.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Matrix data rain — horizontal rows flowing left to right */}
                <div className="flex-1 min-w-0">
                  <Suspense fallback={<DataRainSkeleton />}>
                    <DataRain />
                  </Suspense>
                </div>
              </div>

              {/* CENTER: Connector lines + MCP module */}
              <div className="hidden lg:block w-[140px] h-[460px] shrink-0">
                <HeroConnector />
              </div>

              {/* RIGHT: MCP Install snippet — vertically centered */}
              <div className="w-full lg:flex-1 flex flex-col gap-6 lg:justify-center lg:h-[460px]">
                <h2 className="text-2xl font-bold text-molt-text-primary">
                  Connect Your Agent
                </h2>

                <McpInstallSnippet />
              </div>
            </div>
          </div>
        </section>

        {/* ====== Trust Badges ====== */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 border-b border-molt-stroke-light">
          <div className="mx-auto max-w-5xl">
            <TrustBadges />
          </div>
        </section>

        {/* ====== Capabilities Grid ====== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-molt-text-primary mb-3">
              What Your Agent Gets
            </h2>
            <p className="text-molt-text-secondary mb-8">
              8 structured endpoints covering the DeFi data agents need most
            </p>
            <CapabilitiesGrid />
          </div>
        </section>

        {/* ====== Example Prompts ====== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-molt-text-primary mb-3">
              Example Queries
            </h2>
            <p className="text-molt-text-secondary mb-8">
              Natural language prompts your agent can use — each maps to a real MCP endpoint
            </p>
            <ExamplePrompts />
          </div>
        </section>

        {/* ====== Live Protocol Metrics Table ====== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-molt-text-primary">
                Live Protocol Data
              </h2>
              <p className="mt-2 text-molt-text-secondary">
                Real-time metrics from tracked protocols on Base and Ethereum
              </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Protocol table */}
              <div className="lg:flex-[2] min-w-0">
                <Suspense fallback={<LandingProtocolTableSkeleton />}>
                  <LandingProtocolTable />
                </Suspense>
              </div>

              {/* Connector: animated pulses left → right */}
              <div className="hidden lg:block w-[60px] h-[120px] shrink-0">
                <DataConnector />
              </div>

              {/* "What agents see" JSON preview — vertically centered */}
              <div className="hidden lg:block lg:flex-1 min-w-0">
                <p className="text-xs text-molt-text-muted uppercase tracking-wider mb-3">
                  What agents see
                </p>
                <div className="glass-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-molt-stroke-light bg-molt-bg-tertiary/50">
                    <div className="h-3 w-3 rounded-full bg-data-negative" />
                    <div className="h-3 w-3 rounded-full bg-molt-orange" />
                    <div className="h-3 w-3 rounded-full bg-data-positive" />
                    <span className="ml-2 text-xs text-molt-text-muted font-mono">
                      GET /api/mcp/protocols
                    </span>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs leading-relaxed max-h-[400px]">
                    <code className="font-mono text-molt-green">
                      {sampleJson}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-molt-text-primary mb-3 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-molt-text-secondary mb-8 text-center">
              Everything you need to know about connecting your agent to MoltLlama
            </p>
            <FaqSection />
          </div>
        </section>

        {/* ====== CTA ====== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="bg-molt-accent rounded-molt-lg p-12 text-center shadow-molt-glow">
              <p className="text-sm uppercase tracking-wider text-white/60 mb-4">
                Built for machines, readable by humans
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                This Data Powers AI Agents
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Agents use MoltLlama to create LP positions, review borrowing
                rates, and rebalance portfolios across Base and Ethereum.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/api/mcp"
                  className="inline-block bg-white text-molt-bg font-semibold px-8 py-3 rounded-molt hover:bg-white/90 transition-colors"
                >
                  Connect Your Agent
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-block border border-white/40 text-white font-semibold px-8 py-3 rounded-molt hover:bg-white/10 transition-colors"
                >
                  Explore Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
