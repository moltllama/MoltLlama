import type { ProtocolConfig } from "@/data/protocols/types";

export const COMPOUND_V3: ProtocolConfig = {
  slug: "compound-v3",
  name: "Compound V3",
  category: "lending",
  description:
    "Compound III (Comet) is a streamlined borrowing and lending protocol with a single borrowable asset per deployment. It uses an isolated-market model where each Comet instance has one base asset and multiple collateral assets.",
  logo: "https://icons.llama.fi/compound-v3.png",
  website: "https://compound.finance",
  docs: "https://docs.compound.finance",
  github: "https://github.com/compound-finance/comet",
  chains: {
    base: {
      contracts: [
        {
          name: "cUSDCv3 (Comet)",
          address: "0xb125E6687d4313864e53df431d5425969c15Eb2F",
          purpose:
            "The USDC Comet contract on Base. Serves as the single market for USDC borrowing and lending. Users supply USDC to earn interest or supply collateral assets to borrow USDC.",
          explorerUrl:
            "https://basescan.org/address/0xb125E6687d4313864e53df431d5425969c15Eb2F",
          keyFunctions: [
            {
              name: "supply",
              signature: "supply(address,uint256)",
              selector: "0xf2b9fdb8",
              description:
                "Supply an asset to the protocol. If the asset is the base asset (USDC), it earns interest. If the asset is a collateral asset, it is added as collateral for borrowing.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the asset to supply (USDC for lending, or collateral token address).",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to supply in the asset's native decimals.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xb125E6687d4313864e53df431d5425969c15Eb2F",
                gasEstimate: 200_000,
                notes: [
                  "User must approve the Comet contract to spend the asset.",
                  "Supplying USDC earns interest; supplying other assets adds collateral.",
                  "Interest accrual is automatic and continuous.",
                ],
              },
            },
            {
              name: "withdraw",
              signature: "withdraw(address,uint256)",
              selector: "0xf3fef3a3",
              description:
                "Withdraw an asset from the protocol. Withdraw base asset (USDC) to reduce lending position or initiate a borrow. Withdraw collateral to reclaim collateral.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the asset to withdraw.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to withdraw. Use type(uint256).max to withdraw the entire balance.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 200_000,
                notes: [
                  "Withdrawing more USDC than supplied will create a borrow position.",
                  "Collateral withdrawal may fail if it would make the position undercollateralized.",
                  "No approval needed since the user is withdrawing their own funds.",
                ],
              },
            },
            {
              name: "borrow",
              signature: "withdraw(address,uint256)",
              selector: "0xf3fef3a3",
              description:
                "Borrow the base asset (USDC) against supplied collateral. In Compound V3, borrowing is done via the withdraw function - withdrawing more base asset than supplied creates a borrow.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the base asset to borrow (USDC).",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description: "The amount to borrow in the base asset's decimals.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 250_000,
                notes: [
                  "Borrowing is done via withdraw() when the user has no base asset supplied or withdraws more than supplied.",
                  "User must have supplied sufficient collateral.",
                  "Borrow interest accrues continuously.",
                ],
              },
            },
            {
              name: "repay",
              signature: "supply(address,uint256)",
              selector: "0xf2b9fdb8",
              description:
                "Repay a borrow position. In Compound V3, repaying is done via the supply function - supplying the base asset reduces the borrow balance.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the base asset to repay (USDC).",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to repay. Use type(uint256).max to repay the entire debt.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xb125E6687d4313864e53df431d5425969c15Eb2F",
                gasEstimate: 200_000,
                notes: [
                  "Repaying is done via supply() - supplying USDC reduces the borrow balance.",
                  "User must approve the Comet contract to spend USDC.",
                  "Supplying more than the outstanding debt will start earning interest on the excess.",
                ],
              },
            },
          ],
        },
      ],
      supportedTokens: ["USDC", "ETH", "cbBTC", "wstETH"],
    },
    ethereum: {
      contracts: [
        {
          name: "cUSDCv3 (Comet)",
          address: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
          purpose:
            "The USDC Comet contract on Ethereum mainnet. Serves as the single market for USDC borrowing and lending.",
          explorerUrl:
            "https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3",
          keyFunctions: [
            {
              name: "supply",
              signature: "supply(address,uint256)",
              selector: "0xf2b9fdb8",
              description:
                "Supply an asset to the protocol. If the asset is USDC, it earns interest. If the asset is a collateral asset, it is added as collateral for borrowing.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description:
                    "The address of the asset to supply.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to supply in the asset's native decimals.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
                gasEstimate: 250_000,
                notes: [
                  "User must approve the Comet contract to spend the asset.",
                  "Supplying USDC earns interest; supplying other assets adds collateral.",
                ],
              },
            },
            {
              name: "withdraw",
              signature: "withdraw(address,uint256)",
              selector: "0xf3fef3a3",
              description:
                "Withdraw an asset from the protocol. Withdraw USDC to reduce lending position or initiate a borrow.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the asset to withdraw.",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description: "The amount to withdraw.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 250_000,
                notes: [
                  "Withdrawing more USDC than supplied will create a borrow position.",
                  "Collateral withdrawal may fail if it would make the position undercollateralized.",
                ],
              },
            },
            {
              name: "borrow",
              signature: "withdraw(address,uint256)",
              selector: "0xf3fef3a3",
              description:
                "Borrow the base asset (USDC) against supplied collateral via the withdraw function.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the base asset to borrow (USDC).",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description: "The amount to borrow.",
                },
              ],
              txPreparation: {
                requiresApproval: false,
                gasEstimate: 300_000,
                notes: [
                  "Borrowing is done via withdraw() when the user has no base asset supplied or withdraws more than supplied.",
                  "User must have supplied sufficient collateral.",
                ],
              },
            },
            {
              name: "repay",
              signature: "supply(address,uint256)",
              selector: "0xf2b9fdb8",
              description:
                "Repay a borrow position via the supply function. Supplying USDC reduces the borrow balance.",
              inputs: [
                {
                  name: "asset",
                  type: "address",
                  description: "The address of the base asset to repay (USDC).",
                },
                {
                  name: "amount",
                  type: "uint256",
                  description:
                    "The amount to repay. Use type(uint256).max to repay the entire debt.",
                },
              ],
              txPreparation: {
                requiresApproval: true,
                approvalTarget:
                  "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
                gasEstimate: 250_000,
                notes: [
                  "Repaying is done via supply() - supplying USDC reduces the borrow balance.",
                  "User must approve the Comet contract to spend USDC.",
                ],
              },
            },
          ],
        },
      ],
      supportedTokens: ["USDC", "ETH", "WBTC", "wstETH", "LINK"],
    },
  },
};
