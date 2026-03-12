import type { ProtocolConfig } from "@/data/protocols/types";

export const AAVE_V3: ProtocolConfig = {
  slug: "aave-v3",
  name: "Aave V3",
  category: "lending",
  description:
    "Aave is a decentralized non-custodial liquidity protocol where users can participate as suppliers or borrowers. Suppliers provide liquidity to earn a passive income, while borrowers can obtain over-collateralized loans.",
  logo: "https://icons.llama.fi/aave-v3.png",
  website: "https://aave.com",
  docs: "https://docs.aave.com",
  github: "https://github.com/aave/aave-v3-core",
  chains: {
    base: {
      contracts: [
        {
          name: "Pool",
          address: "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
          purpose:
            "Main entry point for all Aave V3 lending operations on Base. Handles supply, borrow, repay, withdraw, and liquidation.",
          explorerUrl:
            "https://basescan.org/address/0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
          keyFunctions: [
            {
              name: "supply",
              signature: "supply(address,uint256,address,uint16)",
              selector: "0x617ba037",
              description:
                "Supply an amount of underlying asset into the reserve, receiving in return overlying aTokens. The caller receives aTokens in return representing the supplied amount.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the underlying asset to supply.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to be supplied, in the asset's native decimals.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that will receive the aTokens, same as msg.sender if the user wants to receive them on his own wallet.",
                },
                {
                  name: "referralCode",
                  type: "uint16",
                  description:
                    "Referral code for integrators. Use 0 if not applicable.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the Pool contract to spend the asset before calling supply.",
                  "Use type(uint256).max for unlimited approval.",
                  "Supply emits a Supply event with the asset, user, onBehalfOf, and amount.",
                ],
              },
            },
            {
              name: "borrow",
              signature: "borrow(address,uint256,uint256,uint16,address)",
              selector: "0x69328dec",
              description:
                "Allows users to borrow a specific amount of the reserve underlying asset. The user must have sufficient collateral to cover the borrow.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the underlying asset to borrow.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to be borrowed, in the asset's native decimals.",
                },
                {
                  name: "interestRateMode",
                  type: "uint256",
                  description:
                    "The interest rate mode: 1 for Stable, 2 for Variable.",
                },
                {
                  name: "referralCode",
                  type: "uint16",
                  description:
                    "Referral code for integrators. Use 0 if not applicable.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address of the user who will receive the debt. Use msg.sender if borrowing for yourself.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 350_000,
                notes: [
                  "User must have supplied collateral before borrowing.",
                  "Health factor must remain above 1 after the borrow.",
                  "Variable rate (mode 2) is most commonly used.",
                ],
              },
            },
            {
              name: "repay",
              signature: "repay(address,uint256,uint256,address)",
              selector: "0x573ade81",
              description:
                "Repays a borrowed amount on a specific reserve, burning the equivalent debt tokens owned by the user.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the borrowed underlying asset.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to repay. Use type(uint256).max to repay the entire debt.",
                },
                {
                  name: "interestRateMode",
                  type: "uint256",
                  description:
                    "The interest rate mode: 1 for Stable, 2 for Variable.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address of the user whose debt is being repaid. Use msg.sender if repaying your own debt.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
                gasEstimate: 300_000,
                notes: [
                  "User must approve the Pool contract to spend the repayment asset.",
                  "Use type(uint256).max as amount to repay the full outstanding debt.",
                  "Repaying more than the outstanding debt will only deduct the actual debt amount.",
                ],
              },
            },
            {
              name: "withdraw",
              signature: "withdraw(address,uint256,address)",
              selector: "0x69328dec",
              description:
                "Withdraws an amount of underlying asset from the reserve, burning the equivalent aTokens owned by the user.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the underlying asset to withdraw.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The underlying amount to be withdrawn. Use type(uint256).max to withdraw the entire balance.",
                },
                {
                  name: "to",
                  type: "address",
                  description:
                    "The address that will receive the underlying asset.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 250_000,
                notes: [
                  "No separate approval needed as aTokens are burned directly.",
                  "Withdrawal may fail if it would bring health factor below 1.",
                  "Use type(uint256).max to withdraw the entire balance.",
                ],
              },
            },
            {
              name: "liquidationCall",
              signature:
                "liquidationCall(address,address,address,uint256,bool)",
              selector: "0x00a718a9",
              description:
                "Liquidates an undercollateralized position. The caller repays part of the debt and receives the collateral at a discount.",
              inputs: [
                {
                  name: "collateralAsset",
                  type: "address",
                  description:
                    "The address of the underlying asset used as collateral.",
                },
                {
                  name: "debtAsset",
                  type: "address",
                  description:
                    "The address of the underlying borrowed asset to be repaid.",
                },
                {
                  name: "user",
                  type: "address",
                  description:
                    "The address of the borrower getting liquidated.",
                },
                {
                  name: "debtToCover",
                  type: "uint256",
                  description:
                    "The debt amount of borrowed asset the liquidator wants to cover.",
                },
                {
                  name: "receiveAToken",
                  type: "bool",
                  description:
                    "True if the liquidator wants to receive the collateral as aTokens, false to receive the underlying asset.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5",
                gasEstimate: 500_000,
                notes: [
                  "Target user's health factor must be below 1.",
                  "Liquidator must approve the Pool to spend the debtAsset.",
                  "Up to 50% of a user's debt can be liquidated at once (close factor).",
                  "Liquidator receives a bonus on the collateral (liquidation bonus varies per asset).",
                ],
              },
            },
          ],
        },
        {
          name: "Oracle",
          address: "0x2Cc0Fc26eD4563A5ce5e8bdcFE1A2878676Ae156",
          purpose:
            "Aave V3 Price Oracle on Base. Provides asset prices for the lending protocol to calculate health factors and liquidation thresholds.",
          explorerUrl:
            "https://basescan.org/address/0x2Cc0Fc26eD4563A5ce5e8bdcFE1A2878676Ae156",
          keyFunctions: [
            {
              name: "getAssetPrice",
              signature: "getAssetPrice(address)",
              selector: "0xb3596f07",
              description:
                "Returns the price of the given asset in the base currency (USD with 8 decimals).",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the asset to get the price for.",
                },
              ],
            },
            {
              name: "getAssetsPrices",
              signature: "getAssetsPrices(address[])",
              selector: "0x9d23d9f2",
              description:
                "Returns the prices of multiple assets in a single call.",
              inputs: [
                {
                  name: "assets",
                  type: "address[]",
                  description:
                    "The addresses of the assets to get prices for.",
                },
              ],
            },
          ],
        },
      ],
      supportedTokens: ["USDC", "ETH", "cbBTC", "weETH", "USDbC", "wstETH"],
    },
    ethereum: {
      contracts: [
        {
          name: "Pool",
          address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
          purpose:
            "Main entry point for all Aave V3 lending operations on Ethereum mainnet. Handles supply, borrow, repay, withdraw, and liquidation.",
          explorerUrl:
            "https://etherscan.io/address/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
          keyFunctions: [
            {
              name: "supply",
              signature: "supply(address,uint256,address,uint16)",
              selector: "0x617ba037",
              description:
                "Supply an amount of underlying asset into the reserve, receiving in return overlying aTokens.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the underlying asset to supply.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to be supplied, in the asset's native decimals.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address that will receive the aTokens.",
                },
                {
                  name: "referralCode",
                  type: "uint16",
                  description:
                    "Referral code for integrators. Use 0 if not applicable.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
                gasEstimate: 300_000,
                notes: [
                  "User must approve the Pool contract to spend the asset before calling supply.",
                  "Use type(uint256).max for unlimited approval.",
                ],
              },
            },
            {
              name: "borrow",
              signature: "borrow(address,uint256,uint256,uint16,address)",
              selector: "0x69328dec",
              description:
                "Allows users to borrow a specific amount of the reserve underlying asset.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the underlying asset to borrow.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to be borrowed, in the asset's native decimals.",
                },
                {
                  name: "interestRateMode",
                  type: "uint256",
                  description:
                    "The interest rate mode: 1 for Stable, 2 for Variable.",
                },
                {
                  name: "referralCode",
                  type: "uint16",
                  description:
                    "Referral code for integrators. Use 0 if not applicable.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address of the user who will receive the debt.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 400_000,
                notes: [
                  "User must have supplied collateral before borrowing.",
                  "Health factor must remain above 1 after the borrow.",
                ],
              },
            },
            {
              name: "repay",
              signature: "repay(address,uint256,uint256,address)",
              selector: "0x573ade81",
              description:
                "Repays a borrowed amount on a specific reserve, burning the equivalent debt tokens.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the borrowed underlying asset.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to repay. Use type(uint256).max to repay the entire debt.",
                },
                {
                  name: "interestRateMode",
                  type: "uint256",
                  description:
                    "The interest rate mode: 1 for Stable, 2 for Variable.",
                },
                {
                  name: "onBehalfOf",
                  type: "address",
                  description:
                    "The address of the user whose debt is being repaid.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
                gasEstimate: 350_000,
                notes: [
                  "User must approve the Pool contract to spend the repayment asset.",
                  "Use type(uint256).max as amount to repay the full outstanding debt.",
                ],
              },
            },
            {
              name: "withdraw",
              signature: "withdraw(address,uint256,address)",
              selector: "0x69328dec",
              description:
                "Withdraws an amount of underlying asset from the reserve, burning the equivalent aTokens.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the underlying asset to withdraw.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The underlying amount to be withdrawn. Use type(uint256).max for full balance.",
                },
                {
                  name: "to",
                  type: "address",
                  description:
                    "The address that will receive the underlying asset.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 300_000,
                notes: [
                  "No separate approval needed as aTokens are burned directly.",
                  "Withdrawal may fail if it would bring health factor below 1.",
                ],
              },
            },
            {
              name: "liquidationCall",
              signature:
                "liquidationCall(address,address,address,uint256,bool)",
              selector: "0x00a718a9",
              description:
                "Liquidates an undercollateralized position. The caller repays part of the debt and receives collateral at a discount.",
              inputs: [
                {
                  name: "collateralAsset",
                  type: "address",
                  description:
                    "The address of the underlying asset used as collateral.",
                },
                {
                  name: "debtAsset",
                  type: "address",
                  description:
                    "The address of the underlying borrowed asset to be repaid.",
                },
                {
                  name: "user",
                  type: "address",
                  description:
                    "The address of the borrower getting liquidated.",
                },
                {
                  name: "debtToCover",
                  type: "uint256",
                  description:
                    "The debt amount of borrowed asset the liquidator wants to cover.",
                },
                {
                  name: "receiveAToken",
                  type: "bool",
                  description:
                    "True if the liquidator wants to receive the collateral as aTokens.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
                gasEstimate: 600_000,
                notes: [
                  "Target user's health factor must be below 1.",
                  "Liquidator must approve the Pool to spend the debtAsset.",
                  "Up to 50% of a user's debt can be liquidated at once.",
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
        "LINK",
        "AAVE",
      ],
    },
  },
};
