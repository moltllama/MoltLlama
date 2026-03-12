"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";

const ROW_ANIMATIONS = [
  "animate-matrix-1",
  "animate-matrix-2",
  "animate-matrix-3",
  "animate-matrix-4",
  "animate-matrix-5",
  "animate-matrix-6",
  "animate-matrix-7",
];

/** Deterministic distribution — no Math.random to avoid hydration mismatch */
function distributeItems(items: string[], rowCount: number): string[][] {
  const rows: string[][] = Array.from({ length: rowCount }, () => []);
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  shuffled.forEach((item, i) => {
    rows[i % rowCount].push(item);
  });
  return rows;
}

interface DataRainClientProps {
  items: string[];
}

export function DataRainClient({ items }: DataRainClientProps) {
  const rows = useMemo(() => distributeItems(items, 7), [items]);

  return (
    <div className="flex flex-col gap-1 h-full" aria-hidden="true">
      {rows.map((rowItems, rowIdx) => (
        <div
          key={rowIdx}
          className="flex-1 overflow-hidden flex items-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 5%, black 80%, transparent 100%)",
          }}
        >
          <div
            className={cn(
              "flex items-center whitespace-nowrap",
              ROW_ANIMATIONS[rowIdx],
            )}
          >
            {/* Render twice for seamless horizontal loop */}
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {rowItems.map((text, itemIdx) => (
                  <span
                    key={`${copy}-${itemIdx}`}
                    className={cn(
                      "font-mono text-[10px] px-2 text-molt-green inline-block",
                      itemIdx % 5 === 0
                        ? "opacity-70"
                        : itemIdx % 3 === 0
                          ? "opacity-50"
                          : "opacity-30",
                    )}
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
