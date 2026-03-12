import Link from "next/link";

const productLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "MCP API", href: "/api/mcp" },
  { label: "Protocols", href: "/dashboard/protocols" },
];

const chainLinks = [
  { label: "Base", href: "/dashboard?chain=base" },
  { label: "Ethereum", href: "/dashboard?chain=ethereum" },
];

const resourceLinks = [
  { label: "DeFiLlama", href: "https://defillama.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-molt-stroke-light bg-molt-bg-tertiary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-xl font-extrabold">
              <span>🦞</span>{" "}
              <span className="bg-molt-accent bg-clip-text text-transparent">MoltLlama</span>
            </span>
            <p className="mt-3 text-sm text-molt-text-secondary">
              Powering autonomous DeFi agents
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-molt-text-primary uppercase tracking-wide mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-molt-text-secondary hover:text-molt-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Chains */}
          <div>
            <h3 className="text-sm font-semibold text-molt-text-primary uppercase tracking-wide mb-4">
              Chains
            </h3>
            <ul className="space-y-2">
              {chainLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-molt-text-secondary hover:text-molt-text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-molt-text-primary uppercase tracking-wide mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-molt-text-secondary hover:text-molt-text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-molt-stroke-light flex flex-col sm:flex-row items-center justify-between gap-4">
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
          <p className="text-xs text-molt-text-muted">
            &copy; {new Date().getFullYear()} 🦞 MoltLlama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
