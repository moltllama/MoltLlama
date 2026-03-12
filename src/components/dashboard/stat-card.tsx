import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  change?: number | null;
  icon?: LucideIcon;
  loading?: boolean;
}

function ChangeIndicator({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="text-xs font-medium text-data-positive">
        +{value.toFixed(2)}%
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="text-xs font-medium text-data-negative">
        {value.toFixed(2)}%
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-data-neutral">
      {value.toFixed(2)}%
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card p-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded bg-molt-bg-hover" />
        <div className="h-8 w-8 rounded-molt-sm bg-molt-bg-hover" />
      </div>
      <div className="mt-3 h-7 w-28 rounded bg-molt-bg-hover" />
      <div className="mt-2 h-3 w-16 rounded bg-molt-bg-hover" />
    </div>
  );
}

export function StatCard({ label, value, change, icon: Icon, loading }: StatCardProps) {
  if (loading) return <SkeletonCard />;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <p className="metric-label">{label}</p>
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-molt-sm bg-molt-bg-secondary">
            <Icon size={18} className="text-molt-purple" />
          </div>
        )}
      </div>
      <p className="metric-value mt-2">{value}</p>
      {change !== undefined && change !== null && (
        <div className="mt-1">
          <ChangeIndicator value={change} />
        </div>
      )}
    </div>
  );
}
