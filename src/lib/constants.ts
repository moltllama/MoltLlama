export interface SupportedChain {
  name: string;
  slug: string;
  chainId: number;
  defiLlamaName: string;
}

export const SUPPORTED_CHAINS: SupportedChain[] = [
  { name: "Base", slug: "base", chainId: 8453, defiLlamaName: "Base" },
  { name: "Ethereum", slug: "ethereum", chainId: 1, defiLlamaName: "Ethereum" },
];

export const SITE_NAME = "MoltLlama";
export const SITE_DESCRIPTION = "DeFi data and contract interfaces for agents that execute real tasks";
