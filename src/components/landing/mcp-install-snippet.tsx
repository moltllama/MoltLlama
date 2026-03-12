"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const MCP_ENDPOINT =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://moltllama.com") + "/api/mcp";

const snippets = [
  {
    id: "claude",
    label: "Claude",
    code: `// .mcp.json (project) or claude_desktop_config.json
{
  "mcpServers": {
    "moltllama": {
      "type": "http",
      "url": "${MCP_ENDPOINT}"
    }
  }
}`,
  },
  {
    id: "cursor",
    label: "Cursor",
    code: `// .cursor/mcp.json
{
  "mcpServers": {
    "moltllama": {
      "url": "${MCP_ENDPOINT}"
    }
  }
}`,
  },
  {
    id: "vscode",
    label: "VS Code",
    code: `// .vscode/mcp.json
{
  "servers": {
    "moltllama": {
      "type": "http",
      "url": "${MCP_ENDPOINT}"
    }
  }
}`,
  },
  {
    id: "windsurf",
    label: "Windsurf",
    code: `// ~/.codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "moltllama": {
      "serverUrl": "${MCP_ENDPOINT}"
    }
  }
}`,
  },
  {
    id: "generic",
    label: "HTTP",
    code: `# Any MCP-compatible client
MCP_SERVER_URL=${MCP_ENDPOINT}

# Or via curl:
curl ${MCP_ENDPOINT}`,
  },
] as const;

type SnippetId = (typeof snippets)[number]["id"];

export function McpInstallSnippet() {
  const [activeTab, setActiveTab] = useState<SnippetId>(snippets[0].id);
  const [copied, setCopied] = useState(false);

  const activeSnippet = snippets.find((s) => s.id === activeTab) ?? snippets[0];

  function handleCopy() {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Tab bar with terminal chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-molt-stroke-light bg-molt-bg-tertiary/50">
        <div className="h-3 w-3 rounded-full bg-data-negative" />
        <div className="h-3 w-3 rounded-full bg-molt-orange" />
        <div className="h-3 w-3 rounded-full bg-data-positive" />

        <div className="ml-3 flex items-center gap-1 flex-wrap">
          {snippets.map((snippet) => (
            <button
              key={snippet.id}
              type="button"
              onClick={() => {
                setActiveTab(snippet.id);
                setCopied(false);
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                activeTab === snippet.id
                  ? "bg-molt-purple/20 text-molt-purple"
                  : "text-molt-text-muted hover:text-molt-text-secondary",
              )}
            >
              {snippet.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 text-xs text-molt-text-muted hover:text-molt-text-primary transition-colors shrink-0"
          aria-label="Copy snippet"
        >
          {copied ? (
            <>
              <Check size={14} className="text-data-positive" />
              <span className="text-data-positive">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono text-molt-green">{activeSnippet.code}</code>
      </pre>
    </div>
  );
}
