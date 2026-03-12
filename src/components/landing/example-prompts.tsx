const PROMPTS = [
  {
    query: "What's the TVL of Aave V3 on Base?",
    endpoint: "/api/mcp/protocols/aave-v3",
  },
  {
    query: "Show me yield pools above 5% APY on Ethereum",
    endpoint: "/api/mcp/yields?chain=ethereum&minApy=5",
  },
  {
    query: "Get the current price of ETH, USDC, and cbBTC",
    endpoint: "/api/mcp/prices?tokens=ETH,USDC,cbBTC",
  },
  {
    query: "Which DEXs have the highest volume on Base?",
    endpoint: "/api/mcp/dexs?chain=base",
  },
  {
    query: "List all lending protocols sorted by TVL",
    endpoint: "/api/mcp/protocols?category=lending&sort=tvl",
  },
  {
    query: "What are the contract addresses for Compound V3?",
    endpoint: "/api/mcp/contracts?protocol=compound-v3",
  },
  {
    query: "Compare protocol fees on Ethereum vs Base",
    endpoint: "/api/mcp/fees",
  },
];

export function ExamplePrompts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {PROMPTS.map((p) => (
        <div
          key={p.query}
          className="glass-card p-4 flex flex-col gap-2 hover:border-molt-purple/30 transition-colors"
        >
          <p className="text-sm text-molt-text-primary font-medium">
            &ldquo;{p.query}&rdquo;
          </p>
          <code className="text-[11px] font-mono text-molt-purple/70 truncate">
            {p.endpoint}
          </code>
        </div>
      ))}
    </div>
  );
}
