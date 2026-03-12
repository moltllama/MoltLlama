"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  BarChart3,
  FileCode,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Protocols", href: "/dashboard/protocols", icon: Layers },
  { label: "Yields", href: "/dashboard/yields", icon: TrendingUp },
  { label: "DEX Volumes", href: "/dashboard/dexs", icon: BarChart3 },
  { label: "Contracts", href: "/dashboard/contracts", icon: FileCode },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* ---------- Mobile overlay ---------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ---------- Sidebar ---------- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-molt-stroke-light bg-molt-bg-secondary/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold bg-molt-accent bg-clip-text text-transparent">
              MoltLlama
            </span>
          </Link>
          <button
            type="button"
            className="lg:hidden text-molt-text-secondary hover:text-molt-text-primary"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-molt-sm px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-molt-bg-hover text-molt-pink"
                    : "text-molt-text-secondary hover:bg-molt-bg-hover/50 hover:text-molt-text-primary",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-molt-stroke-light">
          <p className="text-xs text-molt-text-muted">
            Powered by{" "}
            <a
              href="https://defillama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-molt-purple hover:text-molt-purple-light transition-colors"
            >
              DeFiLlama
            </a>
          </p>
        </div>
      </aside>

      {/* ---------- Main content ---------- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-molt-stroke-light bg-molt-bg/70 backdrop-blur-lg px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-molt-text-primary"
          >
            <Menu size={22} />
          </button>
          <span className="text-sm font-bold bg-molt-accent bg-clip-text text-transparent">
            MoltLlama
          </span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
