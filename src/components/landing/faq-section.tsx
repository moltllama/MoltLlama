"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { FAQ_ITEMS } from "@/data/faq";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="glass-card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-6 py-4 text-left"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-molt-purple bg-molt-purple/10 px-2 py-0.5 rounded-full shrink-0">
                {item.category}
              </span>
              <span className="text-sm font-medium text-molt-text-primary flex-1">
                {item.question}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-molt-text-muted transition-transform duration-300 shrink-0",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {/* Animated expand/collapse via grid-rows transition */}
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className={cn(
                  "px-6 pb-5 pt-0 transition-opacity duration-300",
                  isOpen ? "opacity-100" : "opacity-0",
                )}>
                  <p className="text-sm text-molt-text-secondary leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
