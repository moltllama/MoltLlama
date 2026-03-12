import type { Metadata } from "next";
import YieldsClient from "./yields-client";

export const metadata: Metadata = {
  title: "Yield Explorer",
  description:
    "Explore DeFi yield farming opportunities across Base and Ethereum with real-time APY data.",
  alternates: { canonical: "/dashboard/yields" },
};

export default function YieldsPage() {
  return <YieldsClient />;
}
