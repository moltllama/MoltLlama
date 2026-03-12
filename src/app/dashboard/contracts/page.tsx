import type { Metadata } from "next";
import ContractsClient from "./contracts-client";

export const metadata: Metadata = {
  title: "Contract Explorer",
  description:
    "Explore DeFi protocol contracts, ABIs, and function signatures for Aave, Uniswap, Compound, and more.",
  alternates: { canonical: "/dashboard/contracts" },
};

export default function ContractsPage() {
  return <ContractsClient />;
}
