import { NextResponse } from "next/server";
import type { McpResponse, McpError } from "@/types/mcp";

/**
 * Build a standard MCP success response with caching headers.
 *
 * @param data    - The response payload
 * @param opts.source - Data source identifier ("defillama" | "onchain" | "registry")
 * @param opts.ttl    - Cache TTL in seconds (used for Cache-Control and nextRefresh)
 * @param opts.chain  - Optional chain identifier to include in the envelope
 */
export function mcpResponse<T>(
  data: T,
  opts: { source: string; ttl: number; chain?: string },
): NextResponse<McpResponse<T>> {
  const now = Math.floor(Date.now() / 1000);

  const body: McpResponse<T> = {
    status: "ok",
    timestamp: now,
    dataAge: 0,
    ...(opts.chain ? { chain: opts.chain } : {}),
    data,
    meta: {
      source: opts.source,
      cacheHit: false,
      nextRefresh: now + opts.ttl,
      version: "1.0.0",
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": `public, s-maxage=${opts.ttl}, stale-while-revalidate=${opts.ttl * 2}`,
    },
  });
}

/**
 * Build a standard MCP error response.
 *
 * @param message - Human-readable error description
 * @param status  - HTTP status code (default 400)
 */
export function mcpError(message: string, status = 400): NextResponse<McpError> {
  return NextResponse.json(
    {
      status: "error" as const,
      error: message,
      timestamp: Math.floor(Date.now() / 1000),
    },
    {
      status,
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  );
}
