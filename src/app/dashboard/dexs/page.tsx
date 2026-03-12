import type { Metadata } from "next";
import DexsClient from "./dexs-client";

export const metadata: Metadata = {
  title: "DEX Volumes",
  description:
    "Track DEX trading volumes across Base and Ethereum with 24h, 7d, and 30d volume data.",
  alternates: { canonical: "/dashboard/dexs" },
};

export default function DexVolumesPage() {
  return <DexsClient />;
}
