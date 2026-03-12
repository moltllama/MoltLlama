import { ShieldCheck, Eye, Blocks, MonitorSmartphone } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    label: "Read-Only",
    detail: "No transaction execution, no private keys",
  },
  {
    icon: Eye,
    label: "Transparent Data",
    detail: "Sourced from DeFiLlama open APIs",
  },
  {
    icon: Blocks,
    label: "8 MCP Endpoints",
    detail: "Protocols, yields, prices, DEXs, fees, contracts, chains",
  },
  {
    icon: MonitorSmartphone,
    label: "100+ Clients",
    detail: "Claude, Cursor, VS Code, Windsurf, ChatGPT, and more",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex items-center gap-3">
          <badge.icon size={20} className="text-molt-green shrink-0" />
          <div>
            <p className="text-sm font-semibold text-molt-text-primary">
              {badge.label}
            </p>
            <p className="text-xs text-molt-text-muted">{badge.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
