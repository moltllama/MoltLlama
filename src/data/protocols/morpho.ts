import type { ProtocolConfig } from "@/data/protocols/types";

export const MORPHO: ProtocolConfig = {
  slug: "morpho",
  name: "Morpho",
  category: "lending",
  description:
    "Morpho is a trustless and efficient lending primitive. It enables the creation of isolated lending markets by specifying any loan asset, collateral asset, oracle, liquidation LTV, and interest rate model. Markets are permissionless and immutable.",
  logo: "https://icons.llama.fi/morpho.png",
  website: "https://morpho.org",
  docs: "https://docs.morpho.org",
  github: "https://github.com/morpho-org/morpho-blue",
  chains: {
    base: {
      contracts: [
        {
          name: "Morpho Blue",
          address: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
          purpose:
            "The core Morpho Blue singleton contract on Base. All lending markets are managed through this single contract. Supports supply, borrow, repay, and withdraw operations across any created market.",
          explorerUrl:
            "https://basescan.org/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
          keyFunctions: [
            {
              name: "supply",
              signature:
                "supply((address,address,address,address,uint256),uint256,uint256,address,bytes)",
              selector: "0xa99aad89",
              description:
                "Supply assets to a specific market. The market is identified by a MarketParams struct containing loan token, collateral token, oracle, IRM, and LLTV.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description:
                    "The market parameters struct: (loanToken, collateralToken, oracle, irm, lltv).",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description:
                    "The amount of assets to supply. Use 0 if specifying shares instead.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description:
                    "The amount of shares to mint. Use 0 if specifying assets instead.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that will own the supply position.",
                },
                {
                  name: "data",
                  type: "bytes",
                  description:
                    "Arbitrary data to pass to the onMorphoSupply callback. Use empty bytes if no callback is needed.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the Morpho contract to spend the loan token.",
                  "Specify either assets OR shares, not both. Set the other to 0.",
                  "Market must already exist (created via createMarket).",
                  "Supply earns interest from borrowers in the same market.",
                ],
              },
            },
            {
              name: "withdraw",
              signature:
                "withdraw((address,address,address,address,uint256),uint256,uint256,address,address)",
              selector: "0x5c2bea49",
              description:
                "Withdraw previously supplied assets from a specific market.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description:
                    "The market parameters struct: (loanToken, collateralToken, oracle, irm, lltv).",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description:
                    "The amount of assets to withdraw. Use 0 if specifying shares instead.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description:
                    "The amount of shares to burn. Use 0 if specifying assets instead.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that owns the supply position to withdraw from.",
                },
                {
                  name: "receiver",
                  type: "address",
                  description:
                    "The address that will receive the withdrawn assets.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 250_000,
                notes: [
                  "No approval needed since the user is withdrawing their own supplied assets.",
                  "Specify either assets OR shares, not both.",
                  "May fail if there is insufficient liquidity in the market.",
                ],
              },
            },
            {
              name: "borrow",
              signature:
                "borrow((address,address,address,address,uint256),uint256,uint256,address,address)",
              selector: "0x50d8cd4b",
              description:
                "Borrow assets from a specific market against supplied collateral.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description:
                    "The market parameters struct: (loanToken, collateralToken, oracle, irm, lltv).",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description:
                    "The amount of assets to borrow. Use 0 if specifying shares.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description:
                    "The amount of shares to mint. Use 0 if specifying assets.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that will own the borrow position.",
                },
                {
                  name: "receiver",
                  type: "address",
                  description:
                    "The address that will receive the borrowed assets.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 300_000,
                notes: [
                  "User must have supplied sufficient collateral to the same market before borrowing.",
                  "The borrow amount is limited by the LLTV (Liquidation Loan-to-Value) of the market.",
                  "Specify either assets OR shares, not both.",
                ],
              },
            },
            {
              name: "repay",
              signature:
                "repay((address,address,address,address,uint256),uint256,uint256,address,bytes)",
              selector: "0x20b76e81",
              description:
                "Repay borrowed assets in a specific market.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description:
                    "The market parameters struct: (loanToken, collateralToken, oracle, irm, lltv).",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description:
                    "The amount of assets to repay. Use 0 if specifying shares.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description:
                    "The amount of shares to burn. Use 0 if specifying assets. Use type(uint256).max to repay all.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address whose borrow position is being repaid.",
                },
                {
                  name: "data",
                  type: "bytes",
                  description:
                    "Arbitrary data to pass to the onMorphoRepay callback. Use empty bytes if no callback is needed.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the Morpho contract to spend the loan token.",
                  "Specify either assets OR shares, not both.",
                  "To repay the full debt, use shares = type(uint256).max.",
                ],
              },
            },
          ],
        },
      ],
      supportedTokens: ["USDC", "ETH", "cbBTC", "wstETH", "weETH"],
    },
    ethereum: {
      contracts: [
        {
          name: "Morpho Blue",
          address: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
          purpose:
            "The core Morpho Blue singleton contract on Ethereum mainnet. All lending markets are managed through this single contract.",
          explorerUrl:
            "https://etherscan.io/address/0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
          keyFunctions: [
            {
              name: "supply",
              signature:
                "supply((address,address,address,address,uint256),uint256,uint256,address,bytes)",
              selector: "0xa99aad89",
              description:
                "Supply assets to a specific market identified by the MarketParams struct.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description:
                    "The market parameters struct: (loanToken, collateralToken, oracle, irm, lltv).",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description: "The amount of assets to supply.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description: "The amount of shares to mint.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that will own the supply position.",
                },
                {
                  name: "data",
                  type: "bytes",
                  description: "Callback data. Use empty bytes if not needed.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
                gasEstimate: 300_000,
                notes: [
                  "User must approve the Morpho contract to spend the loan token.",
                  "Specify either assets OR shares, not both.",
                ],
              },
            },
            {
              name: "withdraw",
              signature:
                "withdraw((address,address,address,address,uint256),uint256,uint256,address,address)",
              selector: "0x5c2bea49",
              description:
                "Withdraw previously supplied assets from a specific market.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description:
                    "The market parameters struct.",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description: "The amount of assets to withdraw.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description: "The amount of shares to burn.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that owns the supply position.",
                },
                {
                  name: "receiver",
                  type: "address",
                  description:
                    "The address that will receive the withdrawn assets.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 300_000,
                notes: [
                  "No approval needed since the user is withdrawing their own supplied assets.",
                  "May fail if there is insufficient liquidity in the market.",
                ],
              },
            },
            {
              name: "borrow",
              signature:
                "borrow((address,address,address,address,uint256),uint256,uint256,address,address)",
              selector: "0x50d8cd4b",
              description:
                "Borrow assets from a specific market against supplied collateral.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description: "The market parameters struct.",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description: "The amount of assets to borrow.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description: "The amount of shares to mint.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that will own the borrow position.",
                },
                {
                  name: "receiver",
                  type: "address",
                  description:
                    "The address that will receive the borrowed assets.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 350_000,
                notes: [
                  "User must have supplied sufficient collateral to the same market.",
                  "The borrow amount is limited by the LLTV of the market.",
                ],
              },
            },
            {
              name: "repay",
              signature:
                "repay((address,address,address,address,uint256),uint256,uint256,address,bytes)",
              selector: "0x20b76e81",
              description:
                "Repay borrowed assets in a specific market.",
              inputs: [
                {
                  name: "marketParams",
                  type: "(address,address,address,address,uint256)",
                  description: "The market parameters struct.",
                },
                {
                  name: "assets",
                  type: "uint256",
                  description: "The amount of assets to repay.",
                },
                {
                  name: "shares",
                  type: "uint256",
                  description: "The amount of shares to burn.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address whose borrow position is being repaid.",
                },
                {
                  name: "data",
                  type: "bytes",
                  description: "Callback data. Use empty bytes if not needed.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
                gasEstimate: 300_000,
                notes: [
                  "User must approve the Morpho contract to spend the loan token.",
                  "To repay the full debt, use shares = type(uint256).max.",
                ],
              },
            },
          ],
        },
      ],
      supportedTokens: [
        "USDC",
        "ETH",
        "WBTC",
        "DAI",
        "USDT",
        "wstETH",
      ],
    },
  },
};
