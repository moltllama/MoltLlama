import type { ProtocolConfig } from "@/data/protocols/types";

export const UNISWAP_V3: ProtocolConfig = {
  slug: "uniswap-v3",
  name: "Uniswap V3",
  category: "dex",
  description:
    "Uniswap is a decentralized exchange protocol that enables automated token swaps through concentrated liquidity pools. V3 introduces concentrated liquidity, allowing LPs to allocate capital within custom price ranges.",
  logo: "https://icons.llama.fi/uniswap-v3.png",
  website: "https://uniswap.org",
  docs: "https://docs.uniswap.org",
  github: "https://github.com/Uniswap/v3-core",
  chains: {
    base: {
      contracts: [
        {
          name: "SwapRouter02",
          address: "0x2626664c2603336E57B271c5C0b26F421741e481",
          purpose:
            "The primary swap router for executing token swaps on Uniswap V3 on Base. Supports exact-input and exact-output single-hop and multi-hop swaps.",
          explorerUrl:
            "https://basescan.org/address/0x2626664c2603336E57B271c5C0b26F421741e481",
          keyFunctions: [
            {
              name: "exactInputSingle",
              signature:
                "exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))",
              selector: "0x04e45aaf",
              description:
                "Swaps an exact amount of one token for as much as possible of another token in a single pool.",
              inputs: [
                {
                  name: "params.tokenIn",
                  type: "address",
                  description: "The contract address of the inbound token.",
                },
                {
                  name: "params.tokenOut",
                  type: "address",
                  description: "The contract address of the outbound token.",
                },
                {
                  name: "params.fee",
                  type: "uint24",
                  description:
                    "The fee tier of the pool (100 = 0.01%, 500 = 0.05%, 3000 = 0.3%, 10000 = 1%).",
                },
                {
                  name: "params.recipient",
                  type: "address",
                  description:
                    "The destination address of the outbound token.",
                },
                {
                  name: "params.amountIn",
                  type: "uint256",
                  description: "The exact amount of the inbound token to swap.",
                },
                {
                  name: "params.amountOutMinimum",
                  type: "uint256",
                  description:
                    "The minimum amount of the outbound token to receive (slippage protection).",
                },
                {
                  name: "params.sqrtPriceLimitX96",
                  type: "uint160",
                  description:
                    "The price limit of the swap. Set to 0 for no limit.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0x2626664c2603336E57B271c5C0b26F421741e481",
                gasEstimate: 200_000,
                notes: [
                  "User must approve the Router to spend tokenIn before calling.",
                  "Set amountOutMinimum to protect against slippage (typically 0.5-1% tolerance).",
                  "Use sqrtPriceLimitX96 = 0 to accept any price within slippage bounds.",
                  "Common fee tiers: 500 (stablecoin pairs), 3000 (most pairs), 10000 (exotic pairs).",
                ],
              },
            },
            {
              name: "exactOutputSingle",
              signature:
                "exactOutputSingle((address,address,uint24,address,uint256,uint256,uint160))",
              selector: "0x5023b4df",
              description:
                "Swaps as little as possible of one token for an exact amount of another token in a single pool.",
              inputs: [
                {
                  name: "params.tokenIn",
                  type: "address",
                  description: "The contract address of the inbound token.",
                },
                {
                  name: "params.tokenOut",
                  type: "address",
                  description: "The contract address of the outbound token.",
                },
                {
                  name: "params.fee",
                  type: "uint24",
                  description:
                    "The fee tier of the pool (100, 500, 3000, or 10000).",
                },
                {
                  name: "params.recipient",
                  type: "address",
                  description:
                    "The destination address of the outbound token.",
                },
                {
                  name: "params.amountOut",
                  type: "uint256",
                  description:
                    "The exact amount of the outbound token to receive.",
                },
                {
                  name: "params.amountInMaximum",
                  type: "uint256",
                  description:
                    "The maximum amount of the inbound token to spend (slippage protection).",
                },
                {
                  name: "params.sqrtPriceLimitX96",
                  type: "uint160",
                  description:
                    "The price limit of the swap. Set to 0 for no limit.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0x2626664c2603336E57B271c5C0b26F421741e481",
                gasEstimate: 210_000,
                notes: [
                  "User must approve the Router to spend tokenIn (at least amountInMaximum) before calling.",
                  "Set amountInMaximum to protect against slippage.",
                  "Useful when the user needs an exact output amount (e.g., repaying a precise debt).",
                  "Any unspent input tokens remain approved but are not transferred.",
                ],
              },
            },
          ],
        },
        {
          name: "Factory",
          address: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
          purpose:
            "Uniswap V3 Factory on Base. Deploys and manages Uniswap V3 liquidity pools. Used for reading pool addresses and fee configurations.",
          explorerUrl:
            "https://basescan.org/address/0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
          keyFunctions: [
            {
              name: "getPool",
              signature: "getPool(address,address,uint24)",
              selector: "0x1698ee82",
              description:
                "Returns the pool address for a given pair of tokens and a fee tier. Returns address(0) if the pool does not exist.",
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
                  name: "fee",
                  type: "uint24",
                  description: "The fee tier (100, 500, 3000, or 10000).",
                },
              ],
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
    ethereum: {
      contracts: [
        {
          name: "SwapRouter",
          address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
          purpose:
            "The primary swap router for executing token swaps on Uniswap V3 on Ethereum mainnet.",
          explorerUrl:
            "https://etherscan.io/address/0xE592427A0AEce92De3Edee1F18E0157C05861564",
          keyFunctions: [
            {
              name: "exactInputSingle",
              signature:
                "exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
              selector: "0x414bf389",
              description:
                "Swaps an exact amount of one token for as much as possible of another token in a single pool.",
              inputs: [
                {
                  name: "params.tokenIn",
                  type: "address",
                  description: "The contract address of the inbound token.",
                },
                {
                  name: "params.tokenOut",
                  type: "address",
                  description: "The contract address of the outbound token.",
                },
                {
                  name: "params.fee",
                  type: "uint24",
                  description:
                    "The fee tier of the pool (500, 3000, or 10000).",
                },
                {
                  name: "params.recipient",
                  type: "address",
                  description:
                    "The destination address of the outbound token.",
                },
                {
                  name: "params.deadline",
                  type: "uint256",
                  description:
                    "The Unix timestamp after which the transaction will revert.",
                },
                {
                  name: "params.amountIn",
                  type: "uint256",
                  description: "The exact amount of the inbound token to swap.",
                },
                {
                  name: "params.amountOutMinimum",
                  type: "uint256",
                  description:
                    "The minimum amount of the outbound token to receive.",
                },
                {
                  name: "params.sqrtPriceLimitX96",
                  type: "uint160",
                  description:
                    "The price limit of the swap. Set to 0 for no limit.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the Router to spend tokenIn before calling.",
                  "Include a deadline parameter for transaction expiry protection.",
                  "Set amountOutMinimum to protect against slippage.",
                ],
              },
            },
            {
              name: "exactOutputSingle",
              signature:
                "exactOutputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))",
              selector: "0xdb3e2198",
              description:
                "Swaps as little as possible of one token for an exact amount of another token in a single pool.",
              inputs: [
                {
                  name: "params.tokenIn",
                  type: "address",
                  description: "The contract address of the inbound token.",
                },
                {
                  name: "params.tokenOut",
                  type: "address",
                  description: "The contract address of the outbound token.",
                },
                {
                  name: "params.fee",
                  type: "uint24",
                  description: "The fee tier of the pool.",
                },
                {
                  name: "params.recipient",
                  type: "address",
                  description:
                    "The destination address of the outbound token.",
                },
                {
                  name: "params.deadline",
                  type: "uint256",
                  description:
                    "The Unix timestamp after which the transaction will revert.",
                },
                {
                  name: "params.amountOut",
                  type: "uint256",
                  description:
                    "The exact amount of the outbound token to receive.",
                },
                {
                  name: "params.amountInMaximum",
                  type: "uint256",
                  description:
                    "The maximum amount of the inbound token to spend.",
                },
                {
                  name: "params.sqrtPriceLimitX96",
                  type: "uint160",
                  description:
                    "The price limit of the swap. Set to 0 for no limit.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                gasEstimate: 260_000,
                notes: [
                  "User must approve the Router to spend tokenIn (at least amountInMaximum).",
                  "Include a deadline parameter for transaction expiry protection.",
                  "Useful when the user needs an exact output amount.",
                ],
              },
            },
          ],
        },
        {
          name: "Factory",
          address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
          purpose:
            "Uniswap V3 Factory on Ethereum. Deploys and manages Uniswap V3 liquidity pools.",
          explorerUrl:
            "https://etherscan.io/address/0x1F98431c8aD98523631AE4a59f267346ea31F984",
          keyFunctions: [
            {
              name: "getPool",
              signature: "getPool(address,address,uint24)",
              selector: "0x1698ee82",
              description:
                "Returns the pool address for a given pair of tokens and a fee tier.",
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
                  name: "fee",
                  type: "uint24",
                  description: "The fee tier.",
                },
              ],
            },
          ],
        },
      ],
      supportedTokens: [
        "ETH",
        "USDC",
        "USDT",
        "DAI",
        "WBTC",
        "wstETH",
        "LINK",
        "AAVE",
      ],
    },
  },
};
