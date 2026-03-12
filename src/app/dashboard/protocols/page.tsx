import type { Metadata } from "next";
import ProtocolsClient from "./protocols-client";

export const metadata: Metadata = {
  title: "DeFi Protocols",
  description:
    "Browse and filter DeFi protocols by chain, category, and TVL on Base and Ethereum.",
  alternates: { canonical: "/dashboard/protocols" },
};

export default function ProtocolsPage() {
  return <ProtocolsClient />;
}
