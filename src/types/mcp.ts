/** Standard MCP API success response envelope */
export interface McpResponse<T> {
  status: "ok" | "error";
  timestamp: number;
  /** Seconds since data was fetched from source */
  dataAge: number;
  chain?: string;
  data: T;
  meta: {
    /** Origin of the data: "defillama" | "onchain" | "registry" */
    source: string;
    /** Whether the response was served from cache */
    cacheHit: boolean;
    /** Unix timestamp when data will next be refreshed */
    nextRefresh: number;
    /** API version */
    version: string;
  };
}

/** Standard MCP API error response */
export interface McpError {
  status: "error";
  error: string;
  timestamp: number;
}
