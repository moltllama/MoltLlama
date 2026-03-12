import type { ChainConfig } from "@/data/chains/base";

export const ETHEREUM_CHAIN: ChainConfig = {
  name: "Ethereum",
  slug: "ethereum",
  chainId: 1,
  defiLlamaName: "Ethereum",
  rpcUrls: ["https://eth.llamarpc.com", "https://rpc.ankr.com/eth"],
  blockExplorer: "https://etherscan.io",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  tokens: {
    ETH: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      isStablecoin: false,
    },
    WETH: {
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      decimals: 18,
      isStablecoin: false,
    },
    USDC: {
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      decimals: 6,
      isStablecoin: true,
    },
    USDT: {
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      decimals: 6,
      isStablecoin: true,
    },
    DAI: {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      decimals: 18,
      isStablecoin: true,
    },
    WBTC: {
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      decimals: 8,
      isStablecoin: false,
    },
    wstETH: {
      address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
      decimals: 18,
      isStablecoin: false,
    },
    stETH: {
      address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      decimals: 18,
      isStablecoin: false,
    },
    LINK: {
      address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      decimals: 18,
      isStablecoin: false,
    },
    AAVE: {
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      decimals: 18,
      isStablecoin: false,
    },
    UNI: {
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      decimals: 18,
      isStablecoin: false,
    },
    MKR: {
      address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
      decimals: 18,
      isStablecoin: false,
    },
    COMP: {
      address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
      decimals: 18,
      isStablecoin: false,
    },
    CRV: {
      address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
      decimals: 18,
      isStablecoin: false,
    },
    rETH: {
      address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      decimals: 18,
      isStablecoin: false,
    },
    cbETH: {
      address: "0xBe9895146f7AF43049ca1c1AE358B0541Ea49704",
      decimals: 18,
      isStablecoin: false,
    },
  },
};
