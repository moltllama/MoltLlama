import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListProtocols } from "./list-protocols";
import { registerGetProtocol } from "./get-protocol";
import { registerGetPrices } from "./get-prices";
import { registerGetChain } from "./get-chain";
import { registerGetYields } from "./get-yields";
import { registerGetDexVolumes } from "./get-dex-volumes";
import { registerGetFees } from "./get-fees";
import { registerGetContracts } from "./get-contracts";

/**
 * Register all MCP tools on the given server instance.
 */
export function registerAllTools(server: McpServer) {
  registerListProtocols(server);
  registerGetProtocol(server);
  registerGetPrices(server);
  registerGetChain(server);
  registerGetYields(server);
  registerGetDexVolumes(server);
  registerGetFees(server);
  registerGetContracts(server);
}
