"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatUsd } from "@/lib/utils/format";

export interface TvlDataPoint {
  date: string;
  base: number;
  ethereum: number;
}

interface TvlChartProps {
  data: TvlDataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card px-4 py-3 text-xs">
      <p className="text-molt-text-primary font-medium mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-molt-text-secondary">{entry.name}:</span>
          <span className="text-molt-text-primary font-medium">
            {formatUsd(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TvlChart({ data }: TvlChartProps) {
  if (!data.length) {
    return (
      <div className="glass-card p-8 flex items-center justify-center h-80">
        <p className="text-molt-text-muted text-sm">No TVL data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-molt-text-primary mb-4">
        TVL - Last 30 Days
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gradientBase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9775fb" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#9775fb" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientEthereum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5217f" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f5217f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#695c82", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickMargin={8}
          />
          <YAxis
            tick={{ fill: "#695c82", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatUsd(v)}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="ethereum"
            name="Ethereum"
            stroke="#f5217f"
            strokeWidth={2}
            fill="url(#gradientEthereum)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="base"
            name="Base"
            stroke="#9775fb"
            strokeWidth={2}
            fill="url(#gradientBase)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
