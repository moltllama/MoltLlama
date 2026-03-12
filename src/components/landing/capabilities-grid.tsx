import {
  Database,
  TrendingUp,
  DollarSign,
  BarChart3,
  FileCode2,
  Globe,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: Database,
    title: "Protocol TVL",
    description:
      "Real-time Total Value Locked across Aave, Uniswap, Compound, Morpho, Aerodrome, and Moonwell.",
  },
  {
    icon: TrendingUp,
    title: "Yield Pools",
    description:
      "APY data for hundreds of pools on Base and Ethereum. Filter by chain, stablecoin-only, or min APY.",
  },
  {
    icon: DollarSign,
    title: "Token Prices",
    description:
      "Current prices for any token via DeFiLlama aggregation. Batch queries supported.",
  },
  {
    icon: BarChart3,
    title: "DEX Volumes",
    description:
      "24h trading volume breakdown per DEX. Track Uniswap, Aerodrome, and others across chains.",
  },
  {
    icon: FileCode2,
    title: "Contract Registry",
    description:
      "Verified contract addresses, key functions, and ABI metadata for supported protocols.",
  },
  {
    icon: Globe,
    title: "Chain Analytics",
    description:
      "Per-chain TVL history, top protocols, and cross-chain comparisons for Base and Ethereum.",
  },
];

export function CapabilitiesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CAPABILITIES.map((cap) => (
        <div key={cap.title} className="glass-card p-6 group">
          <cap.icon
            size={28}
            className="text-molt-purple mb-3 group-hover:text-molt-pink transition-colors"
          />
          <h3 className="text-lg font-bold text-molt-text-primary mb-2">
            {cap.title}
          </h3>
          <p className="text-sm text-molt-text-secondary leading-relaxed">
            {cap.description}
          </p>
        </div>
      ))}
    </div>
  );
}
