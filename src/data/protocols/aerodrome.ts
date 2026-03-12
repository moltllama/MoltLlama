import type { ProtocolConfig } from "@/data/protocols/types";

export const AERODROME: ProtocolConfig = {
  slug: "aerodrome",
  name: "Aerodrome",
  category: "dex",
  description:
    "Aerodrome Finance is the central trading and liquidity marketplace on Base. It combines a powerful decentralized exchange with a vote-escrowed token model to incentivize liquidity provision and align protocol stakeholders.",
  logo: "https://icons.llama.fi/aerodrome.png",
  website: "https://aerodrome.finance",
  docs: "https://docs.aerodrome.finance",
  github: "https://github.com/aerodrome-finance/contracts",
  chains: {
    base: {
      contracts: [
        {
          name: "Router",
          address: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
          purpose:
            "The primary router for Aerodrome on Base. Handles token swaps, liquidity provision, and liquidity removal across stable and volatile pools.",
          explorerUrl:
            "https://basescan.org/address/0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
          keyFunctions: [
            {
              name: "addLiquidity",
              signature:
                "addLiquidity(address,address,bool,uint256,uint256,uint256,uint256,address,uint256)",
              selector: "0x5a47ddc3",
              description:
                "Add liquidity to a pool. The caller provides both tokens in the pair and receives LP tokens in return.",
              inputs: [
                {
                  name: "tokenA",
                  type: "address",
                  description: "The first token of the pair.",
                },
                {
                  name: "tokenB",
                  type: "address",
                  description: "The second token of the pair.",
                },
                {
                  name: "stable",
                  type: "bool",
                  description:
                    "True for stable pools (correlated assets like USDC/USDbC), false for volatile pools.",
                },
                {
                  name: "amountADesired",
                  type: "uint256",
                  description: "The desired amount of tokenA to add.",
                },
                {
                  name: "amountBDesired",
                  type: "uint256",
                  description: "The desired amount of tokenB to add.",
                },
                {
                  name: "amountAMin",
                  type: "uint256",
                  description:
                    "The minimum amount of tokenA to add (slippage protection).",
                },
                {
                  name: "amountBMin",
                  type: "uint256",
                  description:
                    "The minimum amount of tokenB to add (slippage protection).",
                },
                {
                  name: "to",
                  type: "address",
                  description:
                    "The address that will receive the LP tokens.",
                },
                {
                  name: "deadline",
                  type: "uint256",
                  description:
                    "The Unix timestamp after which the transaction will revert.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
                gasEstimate: 350_000,
                notes: [
                  "User must approve the Router to spend both tokenA and tokenB.",
                  "The actual amounts added may differ from desired amounts to maintain the pool ratio.",
                  "Use stable=true for correlated asset pairs (e.g., USDC/USDbC).",
                  "Use stable=false for volatile pairs (e.g., ETH/USDC).",
                ],
              },
            },
            {
              name: "removeLiquidity",
              signature:
                "removeLiquidity(address,address,bool,uint256,uint256,uint256,address,uint256)",
              selector: "0x0dede6c4",
              description:
                "Remove liquidity from a pool. The caller burns LP tokens and receives both underlying tokens in return.",
              inputs: [
                {
                  name: "tokenA",
                  type: "address",
                  description: "The first token of the pair.",
                },
                {
                  name: "tokenB",
                  type: "address",
                  description: "The second token of the pair.",
                },
                {
                  name: "stable",
                  type: "bool",
                  description:
                    "True for stable pools, false for volatile pools.",
                },
                {
                  name: "liquidity",
                  type: "uint256",
                  description: "The amount of LP tokens to burn.",
                },
                {
                  name: "amountAMin",
                  type: "uint256",
                  description:
                    "The minimum amount of tokenA to receive (slippage protection).",
                },
                {
                  name: "amountBMin",
                  type: "uint256",
                  description:
                    "The minimum amount of tokenB to receive (slippage protection).",
                },
                {
                  name: "to",
                  type: "address",
                  description:
                    "The address that will receive the underlying tokens.",
                },
                {
                  name: "deadline",
                  type: "uint256",
                  description:
                    "The Unix timestamp after which the transaction will revert.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
                gasEstimate: 300_000,
                notes: [
                  "User must approve the Router to spend the LP tokens.",
                  "Set amountAMin and amountBMin to protect against slippage.",
                  "The amounts received are proportional to the user's share of the pool.",
                ],
              },
            },
            {
              name: "swapExactTokensForTokens",
              signature:
                "swapExactTokensForTokens(uint256,uint256,(address,address,bool,address)[],address,uint256)",
              selector: "0x8af392e7",
              description:
                "Swap an exact amount of input tokens for as many output tokens as possible along the specified route.",
              inputs: [
                {
                  name: "amountIn",
                  type: "uint256",
                  description: "The exact amount of input tokens to swap.",
                },
                {
                  name: "amountOutMin",
                  type: "uint256",
                  description:
                    "The minimum amount of output tokens to receive (slippage protection).",
                },
                {
                  name: "routes",
                  type: "(address,address,bool,address)[]",
                  description:
                    "Array of route structs defining the swap path. Each route specifies: from token, to token, whether the pool is stable, and the factory address.",
                },
                {
                  name: "to",
                  type: "address",
                  description:
                    "The address that will receive the output tokens.",
                },
                {
                  name: "deadline",
                  type: "uint256",
                  description:
                    "The Unix timestamp after which the transaction will revert.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the Router to spend the input token.",
                  "Routes define the swap path - can be multi-hop through different pools.",
                  "Set amountOutMin to protect against slippage (typically 0.5-1% tolerance).",
                  "The factory address in routes should be 0x420DD381b31aEf6683db6B902084cB0FFECe40Da.",
                ],
              },
            },
          ],
        },
        {
          name: "Factory",
          address: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
          purpose:
            "Aerodrome Pool Factory on Base. Deploys and manages liquidity pools. Supports both stable (correlated) and volatile (uncorrelated) pool types.",
          explorerUrl:
            "https://basescan.org/address/0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
          keyFunctions: [
            {
              name: "getPool",
              signature: "getPool(address,address,bool)",
              selector: "0x1b1dc0de",
              description:
                "Returns the pool address for a given pair of tokens and pool type.",
              inputs: [
                {
                  name: "tokenA",
                  type: "address",
                  description: "The first token of the pair.",
                },
                {
                  name: "tokenB",
                  type: "address",
                  description: "The second token of the pair.",
                },
                {
                  name: "stable",
                  type: "bool",
                  description:
                    "True for stable pool, false for volatile pool.",
                },
              ],
            },
            {
              name: "allPoolsLength",
              signature: "allPoolsLength()",
              selector: "0xefde4e64",
              description: "Returns the total number of pools created.",
              inputs: [],
            },
          ],
        },
      ],
      supportedTokens: [
        "ETH",
        "USDC",
        "USDbC",
        "cbBTC",
        "AERO",
        "weETH",
        "wstETH",
        "BRETT",
      ],
    },
  },
};
