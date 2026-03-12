export const CACHE_TTL = {
  PROTOCOLS: 300,        // 5 min
  PROTOCOL_DETAIL: 600,  // 10 min
  CHAIN_TVL: 1800,       // 30 min
  TOKEN_PRICES: 60,      // 1 min
  DEX_VOLUMES: 300,      // 5 min
  FEES: 600,             // 10 min
  YIELD_POOLS: 300,      // 5 min
  CONTRACTS: 86400,      // 24 hr (static)
} as const;
