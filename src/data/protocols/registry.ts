import type { ProtocolConfig } from "./types";
import { AAVE_V3 } from "./aave-v3";

/** All locally registered protocol configs, keyed by slug */
const PROTOCOL_REGISTRY: Record<string, ProtocolConfig> = {
  [AAVE_V3.slug]: AAVE_V3,
};

/** Get a single protocol config by slug, or null if not in the registry */
export function getRegistryProtocol(slug: string): ProtocolConfig | null {
  return PROTOCOL_REGISTRY[slug] ?? null;
}

/** Get all registered protocol configs */
export function getAllRegistryProtocols(): ProtocolConfig[] {
  return Object.values(PROTOCOL_REGISTRY);
}
