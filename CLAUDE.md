# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm start        # Serve production build
```

No test framework is configured.

## Architecture

**MoltLlama** is a Next.js 14 App Router project that aggregates DeFi protocol data from DeFiLlama into a dashboard and a machine-readable MCP (Model Context Protocol) API. It targets Base and Ethereum chains.

### Three surfaces, one data layer

1. **MCP REST API** (`src/app/api/mcp/[endpoint]/route.ts`) — JSON endpoints for HTTP consumers. All responses use the `McpResponse<T>` envelope from `src/types/mcp.ts`, built via `mcpResponse()` / `mcpError()` helpers in `src/lib/mcp/helpers.ts`. Endpoints: protocols, protocols/[slug], prices, chains/[chain], yields, dexs, fees, contracts. Responses include `Access-Control-Allow-Origin: *` and `Cache-Control: public, s-maxage={ttl}, stale-while-revalidate={ttl * 2}`.

2. **Native MCP protocol** (`src/app/api/mcp/route.ts`) — SSE-based handler built with `mcp-handler` + `@modelcontextprotocol/sdk` for direct AI agent tool registration. Tools are defined in `src/lib/mcp/tools/` using Zod schemas and registered via `registerAllTools()` in `tools/index.ts`. Adding a new data source means creating BOTH a REST route handler AND a tool file here.

3. **Dashboard** (`src/app/dashboard/`) — Mixed rendering. Overview and protocols pages are server components fetching via `dataProvider` from `@/lib/providers`. Contracts and DEX pages are `"use client"` components using SWR to fetch from the MCP REST endpoints (unwrapping the `McpResponse` envelope). The dashboard layout is a client component with sidebar navigation.

4. **Landing page** (`src/app/page.tsx`) — Data-first landing page with live protocol metrics, MCP install snippets, and agent CTA. Uses server components with `<Suspense>` for streaming SSR. Components in `src/components/landing/`.

### Data flow

- `src/lib/providers/` — **Modular data provider system with failover.** The `dataProvider` singleton (exported from `index.ts`) is the primary entry point for all data fetching. It chains: `CachedDataProvider` → `DataProviderManager` → `[DefiLlamaProvider, CoinGeckoProvider]`. All consumers import `dataProvider` from `@/lib/providers`.
  - `types.ts` — `DataProvider` interface (8 methods), `DataMethodName`, `ProviderHealth`
  - `token-bucket.ts` — Reusable token-bucket rate limiter (shared by all providers)
  - `health.ts` — `CircuitBreaker` class: 5-failure threshold → 60s open → half-open retry
  - `defillama-provider.ts` — Primary provider (all 8 methods), uses DeFiLlama free/pro API
  - `coingecko/` — Fallback provider: `client.ts` (HTTP + rate limiter 0.5 req/sec), `adapter.ts` (maps CoinGecko → DeFiLlama types), `provider.ts` (prices only; other methods return null)
  - `manager.ts` — `DataProviderManager`: tries providers in order per-method with circuit breakers
  - `cached-provider.ts` — `CachedDataProvider`: wraps manager with Redis/LRU cache (identical keys + TTLs as before)
- `src/lib/defillama/` — Legacy module. `client.ts` still contains `DefiLlamaClient` (with cache) but is no longer used by consumers. `index.ts` re-exports `dataProvider` as `defiLlama` for backward compatibility. Types in `types.ts` remain the canonical data shapes.
- `src/lib/cache/` — Two-tier caching: Upstash Redis (production) with LRU memory fallback (dev/same-invocation). Both are always written to; Redis is tried first on reads. TTLs in `src/lib/cache/ttl.ts`: prices 60s, protocols/dexs/yields 5min, protocol detail/fees 10min, chain TVL 30min, contracts 24hr.
- `src/data/protocols/` — Static protocol registry with contract addresses, ABIs, function signatures, and tx preparation metadata. Each protocol is a separate file exporting a `ProtocolConfig`. The main entry point is `index.ts` (exports `getProtocol()`, `getProtocolsByChain()`, `getProtocolsByCategory()`, `getAllProtocolSlugs()`). Note: `registry.ts` is legacy/stub — always import from `@/data/protocols`.
- `src/lib/constants.ts` — `SUPPORTED_CHAINS` array is the single source of truth for valid chains. Maps slug (`"base"`) → chainId (8453) → defiLlamaName (`"Base"`). DeFiLlama uses capitalized names; the API uses lowercase slugs.

### Adding a new data provider

Implement the `DataProvider` interface from `src/lib/providers/types.ts` (return `null` for unsupported methods). Add the new provider to the array in `src/lib/providers/index.ts`. The manager handles fallback ordering and circuit breaking automatically.

### Adding a new protocol

Create a new file in `src/data/protocols/` exporting a `ProtocolConfig` (see `types.ts`). Required fields: `slug`, `name`, `category` (one of: lending, dex, yield, bridge, derivatives, staking, cdp), `description`, `logo`, `website`, and `chains` (a `Record<string, ChainProtocolConfig>` mapping chain slugs to contracts and supported tokens). Add it to the `protocols` array in `src/data/protocols/index.ts`.

### Component organization

- `src/components/dashboard/` — Server-compatible data display (stat-card, tvl-chart, protocol-table)
- `src/components/landing/` — Landing page sections (hero-stats, data-rain, faq-section, mcp-install-snippet)
- `src/components/layout/` — Site-wide chrome (navbar, footer)
- `src/components/shared/` — Reusable primitives (`<FormatNumber>`, `<PercentChange>`, used in both contexts)

### Shared utilities

- `src/lib/utils/cn.ts` — `cn()` helper (clsx + tailwind-merge) for conditional classNames
- `src/lib/utils/format.ts` — `formatUsd()`, `formatPercent()`, `formatNumber()`, `shortenAddress()`

### Path alias

`@/*` maps to `./src/*` (configured in tsconfig.json).

## Key conventions

- **Config format**: `next.config.mjs` (ESM, not .ts — Next.js 14 doesn't support .ts config)
- **ESLint**: v8.x with eslint-config-next@14 (not ESLint 9.x)
- **Package manager**: npm
- **Naming**: The protocol is called **MCP** (Model Context Protocol), not MPC. Use `mcp`/`MCP`/`Mcp` consistently.
- **Styling**: Tailwind CSS with `molt-*` custom color/radius/shadow tokens defined in `tailwind.config.ts`. Use `glass-card` class for card containers, `rounded-molt` for standard border radius, `btn-accent`/`btn-secondary` for buttons.
- **Fonts**: Montserrat (sans) + JetBrains Mono (mono), loaded via `next/font/google` CSS variables
- **Icons**: lucide-react
- **UI primitives**: Radix UI (tooltip, dialog, tabs, scroll-area, separator, slot) + @tanstack/react-table
- **Charts**: recharts (client-side only — chart components must be `"use client"`)
- **Validation**: Zod v4 (used exclusively in MCP tool input schemas in `src/lib/mcp/tools/`; REST routes use manual query param validation)
- **Client components**: Any component using hooks, onClick, or browser APIs must have `"use client"` directive
- **Images**: Remote images allowed from `icons.llama.fi` (configured in next.config.mjs)
- **Redirects**: `/api/mpc/*` permanently redirects to `/api/mcp/*` for backwards compatibility

## Environment variables

See `.env.example`. Only `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are needed for production caching; the app works without them using the LRU memory fallback.
