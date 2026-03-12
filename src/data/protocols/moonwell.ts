import type { ProtocolConfig } from "@/data/protocols/types";

export const MOONWELL: ProtocolConfig = {
  slug: "moonwell",
  name: "Moonwell",
  category: "lending",
  description:
    "Moonwell is a decentralized lending and borrowing protocol built on Base. It is a fork of Compound V2 with additional features and governance. Users can supply assets to earn interest or borrow against their collateral.",
  logo: "https://icons.llama.fi/moonwell.png",
  website: "https://moonwell.fi",
  docs: "https://docs.moonwell.fi",
  github: "https://github.com/moonwell-fi/moonwell-contracts-v2",
  chains: {
    base: {
      contracts: [
        {
          name: "Comptroller",
          address: "0xfBb21d0380beE3312B33c4353c8936a0F13EF26C",
          purpose:
            "The Moonwell Comptroller on Base. Acts as the risk management layer, controlling which markets users can enter, collateral factors, and liquidation incentives. Users must enter markets before supplying or borrowing.",
          explorerUrl:
            "https://basescan.org/address/0xfBb21d0380beE3312B33c4353c8936a0F13EF26C",
          keyFunctions: [
            {
              name: "enterMarkets",
              signature: "enterMarkets(address[])",
              selector: "0xc2998238",
              description:
                "Enter a list of markets (mToken addresses) to enable them as collateral. Must be called before supplying or borrowing from a market.",
              inputs: [
                {
                  name: "mTokens",
                  type: "address[]",
                  description:
                    "The list of mToken addresses to enter as markets.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 150_000,
                notes: [
                  "Must be called before using any market for the first time.",
                  "Enables the supplied asset to be used as collateral for borrowing.",
                  "Can enter multiple markets in a single transaction.",
                ],
              },
            },
            {
              name: "exitMarket",
              signature: "exitMarket(address)",
              selector: "0xede4edd0",
              description:
                "Exit a market, removing the asset as collateral. Will fail if the user has an outstanding borrow that requires the asset as collateral.",
              inputs: [
                {
                  name: "mTokenAddress",
                  type: "address",
                  description: "The mToken address to exit.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 150_000,
                notes: [
                  "Will revert if exiting would cause the account to be undercollateralized.",
                  "User must repay borrows or add collateral before exiting if needed.",
                ],
              },
            },
            {
              name: "getAccountLiquidity",
              signature: "getAccountLiquidity(address)",
              selector: "0x5ec88c79",
              description:
                "Returns the account's excess liquidity and shortfall. Liquidity > 0 means the account can borrow more. Shortfall > 0 means the account is liquidatable.",
              inputs: [
                {
                  name: "account",
                  type: "address",
                  description: "The address to check liquidity for.",
                },
              ],
            },
          ],
        },
        {
          name: "mToken (Supply/Borrow)",
          address: "0xfBb21d0380beE3312B33c4353c8936a0F13EF26C",
          purpose:
            "Moonwell mToken contracts represent individual lending markets. Each mToken wraps an underlying asset (e.g., mUSDC wraps USDC). Users interact with mTokens to mint (supply), redeem (withdraw), borrow, and repay.",
          explorerUrl:
            "https://basescan.org/address/0xfBb21d0380beE3312B33c4353c8936a0F13EF26C",
          keyFunctions: [
            {
              name: "mint",
              signature: "mint(uint256)",
              selector: "0xa0712d68",
              description:
                "Supply the underlying asset and receive mTokens in return. The mTokens represent the user's share of the supply pool and accrue interest over time.",
              inputs: [
                {
                  name: "mintAmount",
                  type: "uint256",
                  description:
                    "The amount of the underlying asset to supply, in the asset's native decimals.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget: "mToken address (varies per asset)",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the specific mToken contract to spend the underlying asset.",
                  "The user receives mTokens at the current exchange rate.",
                  "Interest accrues by the mToken exchange rate increasing over time.",
                  "Must call enterMarkets on the Comptroller first to use as collateral.",
                ],
              },
            },
            {
              name: "redeem",
              signature: "redeem(uint256)",
              selector: "0xdb006a75",
              description:
                "Redeem mTokens in exchange for the underlying asset. Burns the specified amount of mTokens and returns the underlying asset at the current exchange rate.",
              inputs: [
                {
                  name: "redeemTokens",
                  type: "uint256",
                  description:
                    "The number of mTokens to redeem.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 250_000,
                notes: [
                  "No approval needed since the user is redeeming their own mTokens.",
                  "Will revert if redemption would cause the account to be undercollateralized.",
                  "Use redeemUnderlying() instead if you want to specify the exact amount of underlying to receive.",
                ],
              },
            },
            {
              name: "borrow",
              signature: "borrow(uint256)",
              selector: "0xc5ebeaec",
              description:
                "Borrow the underlying asset from the pool. The user must have entered the market and have sufficient collateral.",
              inputs: [
                {
                  name: "borrowAmount",
                  type: "uint256",
                  description:
                    "The amount of the underlying asset to borrow, in the asset's native decimals.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 300_000,
                notes: [
                  "User must have entered the market via Comptroller.enterMarkets().",
                  "User must have sufficient collateral to cover the borrow.",
                  "Interest accrues on the borrow balance continuously.",
                  "Check getAccountLiquidity() on the Comptroller to verify available borrow capacity.",
                ],
              },
            },
            {
              name: "repayBorrow",
              signature: "repayBorrow(uint256)",
              selector: "0x0e752702",
              description:
                "Repay the borrowed underlying asset. Reduces the user's borrow balance.",
              inputs: [
                {
                  name: "repayAmount",
                  type: "uint256",
                  description:
                    "The amount to repay, in the asset's native decimals. Use type(uint256).max to repay the entire borrow balance.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget: "mToken address (varies per asset)",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the mToken contract to spend the underlying asset.",
                  "Use type(uint256).max as repayAmount to repay the full outstanding borrow.",
                  "Repaying more than the outstanding borrow will revert.",
                ],
              },
            },
          ],
        },
      ],
      supportedTokens: [
        "USDC",
        "ETH",
        "cbBTC",
        "wstETH",
        "weETH",
        "AERO",
        "USDbC",
      ],
    },
  },
};
