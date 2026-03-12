export interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Setup",
    question: "How do I connect MoltLlama to my AI agent?",
    answer:
      "Add the MoltLlama MCP endpoint URL to your agent's MCP configuration file. We support Claude Desktop, Cursor, VS Code, Windsurf, JetBrains IDEs, and any MCP-compatible client. No API key required for the free tier.",
  },
  {
    category: "Setup",
    question: "Does MoltLlama execute transactions or hold funds?",
    answer:
      "No. MoltLlama is a read-only data layer. It provides protocol metrics, yield data, token prices, and contract metadata. It never signs transactions, holds private keys, or moves funds. Your agent uses this data to make informed decisions, but execution happens through separate tools.",
  },
  {
    category: "Data",
    question: "Where does the data come from?",
    answer:
      "All data is sourced from DeFiLlama's public and paid APIs, the most trusted open data aggregator in DeFi. Protocol metrics, yield pools, DEX volumes, and fee data are refreshed continuously. Contract registry data is curated and verified by the MoltLlama team.",
  },
  {
    category: "Data",
    question: "Which chains and protocols are supported?",
    answer:
      "MoltLlama currently covers Base and Ethereum with deep support for 6 protocols: Aave V3, Uniswap V3, Compound V3, Aerodrome, Morpho, and Moonwell. General TVL and yield data spans all protocols tracked by DeFiLlama on these chains.",
  },
  {
    category: "Limits",
    question: "What are the rate limits?",
    answer:
      "Free tier allows 60 requests per minute and 1,000 requests per hour per IP. Responses include Cache-Control headers — agents should respect cache directives to minimize redundant requests and stay within limits.",
  },
  {
    category: "Compatibility",
    question: "Which AI clients support MCP?",
    answer:
      "MCP is supported by 100+ clients including Claude Desktop, Claude Code, Cursor, VS Code (Copilot), Windsurf, JetBrains IDEs, ChatGPT, Gemini, Cline, Continue, Zed, n8n, and many more. Any client that supports the Model Context Protocol standard can use MoltLlama.",
  },
  {
    category: "Compatibility",
    question: "Can I use MoltLlama with OpenClaw / ElizaOS / custom agents?",
    answer:
      "Yes. Any agent framework that supports MCP servers can connect to MoltLlama. For frameworks without native MCP support, you can use the HTTP endpoint directly — it returns standard JSON responses.",
  },
];
