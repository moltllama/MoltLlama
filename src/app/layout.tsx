import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moltllama.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MoltLlama - DeFi Data for Task-Executing Agents",
    template: "%s | MoltLlama",
  },
  description:
    "Protocol metrics, yield data, and contract interfaces for AI agents that create LP positions, manage borrowing, and rebalance portfolios on Base and Ethereum.",
  keywords: [
    "DeFi",
    "MCP",
    "Model Context Protocol",
    "AI agents",
    "Base",
    "Ethereum",
    "DeFiLlama",
    "TVL",
    "yield farming",
    "DEX",
  ],
  authors: [{ name: "MoltLlama" }],
  openGraph: {
    title: "MoltLlama - DeFi Data for Task-Executing Agents",
    description:
      "Protocol metrics, yield data, and contract interfaces for AI agents that create LP positions, manage borrowing, and rebalance portfolios on Base and Ethereum.",
    type: "website",
    siteName: "MoltLlama",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "MoltLlama - DeFi Data for Task-Executing Agents",
    description:
      "Protocol metrics, yield data, and contract interfaces for AI agents that create LP positions, manage borrowing, and rebalance portfolios on Base and Ethereum.",
  },
  other: {
    "theme-color": "#27173b",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://icons.llamao.fi" />
      </head>
      <body
        className={`${montserrat.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MoltLlama",
              url: siteUrl,
              description:
                "Protocol metrics, yield data, and contract interfaces for AI agents on Base and Ethereum.",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
