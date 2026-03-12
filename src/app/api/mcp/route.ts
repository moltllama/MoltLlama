import { createMcpHandler } from "mcp-handler";
import { registerAllTools } from "@/lib/mcp/tools";

const handler = createMcpHandler(
  (server) => {
    registerAllTools(server);
  },
  {
    serverInfo: {
      name: "MoltLlama",
      version: "1.0.0",
    },
  },
  { basePath: "/api", maxDuration: 60 },
);

export { handler as GET, handler as POST, handler as DELETE };
export const maxDuration = 60;
