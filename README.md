# MoltLlama

DeFi data and contract interfaces for AI agents that execute real tasks.

**Live at [moltllama.com](https://moltllama.com)**

## What it does

MoltLlama aggregates DeFi protocol data from DeFiLlama into three surfaces:

- **MCP API** — Machine Context Protocol endpoints for AI agents to discover and call DeFi tools (protocols, yields, prices, DEX volumes, fees, contracts)
- **REST API** — JSON endpoints at `/api/mcp/*` for any HTTP consumer
- **Dashboard** — Web UI for browsing protocols, yields, DEX volumes, and contract interfaces

Supported chains: Ethereum, Base. Protocols include Aave V3, Uniswap V3, Compound V3, Aerodrome, Morpho, and Moonwell.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at `localhost:3000`. No environment variables are required for development — caching falls back to in-memory LRU.

## MCP integration

Add to your AI agent's MCP config:

```json
{
  "mcpServers": {
    "moltllama": {
      "url": "https://moltllama.com/api/mcp"
    }
  }
}
```

## API endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/mcp/protocols` | List all tracked protocols with TVL |
| `GET /api/mcp/protocols/[slug]` | Protocol detail (TVL, fees, revenue) |
| `GET /api/mcp/prices` | Current token prices |
| `GET /api/mcp/chains/[chain]` | Chain TVL and stats |
| `GET /api/mcp/yields` | Yield opportunities across protocols |
| `GET /api/mcp/dexs` | DEX trading volumes |
| `GET /api/mcp/fees` | Protocol fee data |
| `GET /api/mcp/contracts` | Contract addresses, ABIs, and function signatures |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | Production | Redis cache URL |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Redis cache token |
| `DEFILLAMA_API_KEY` | No | DeFiLlama Pro API key |
| `COINGECKO_API_KEY` | No | CoinGecko Pro API key (fallback provider) |
| `BASE_RPC_URL` | No | Base chain RPC endpoint |
| `ETHEREUM_RPC_URL` | No | Ethereum RPC endpoint |

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts · Radix UI · SWR · Zod · Upstash Redis

## License

All rights reserved.
