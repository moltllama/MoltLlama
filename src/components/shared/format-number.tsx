"use client";

interface FormatNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
}

function abbreviate(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

export function FormatNumber({ value, prefix = "", suffix = "" }: FormatNumberProps) {
  return (
    <span>
      {prefix}
      {abbreviate(value)}
      {suffix}
    </span>
  );
}
