export interface TokenConfig {
  address: string;
  decimals: number;
  isStablecoin: boolean;
}

export interface ChainConfig {
  name: string;
  slug: string;
  chainId: number;
  defiLlamaName: string;
  rpcUrls: string[];
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  tokens: Record<string, TokenConfig>;
}

export const BASE_CHAIN: ChainConfig = {
  name: "Base",
  slug: "base",
  chainId: 8453,
  defiLlamaName: "Base",
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorer: "https://basescan.org",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  tokens: {
    ETH: {
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      isStablecoin: false,
    },
    USDC: {
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      isStablecoin: true,
    },
    cbBTC: {
      address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
      decimals: 8,
      isStablecoin: false,
    },
    AERO: {
      address: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
      decimals: 18,
      isStablecoin: false,
    },
    weETH: {
      address: "0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A",
      decimals: 18,
      isStablecoin: false,
    },
    wstETH: {
      address: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452",
      decimals: 18,
      isStablecoin: false,
    },
    USDbC: {
      address: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
      decimals: 6,
      isStablecoin: true,
    },
    BRETT: {
      address: "0x532f27101965dd16442E59d40670FaF5eBB142E4",
      decimals: 18,
      isStablecoin: false,
    },
  },
};
