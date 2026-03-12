import type { ProtocolCategory, ProtocolConfig } from "@/data/protocols/types";
import { AAVE_V3 } from "@/data/protocols/aave-v3";
import { UNISWAP_V3 } from "@/data/protocols/uniswap-v3";
import { COMPOUND_V3 } from "@/data/protocols/compound-v3";
import { AERODROME } from "@/data/protocols/aerodrome";
import { MORPHO } from "@/data/protocols/morpho";
import { MOONWELL } from "@/data/protocols/moonwell";

export type { ProtocolCategory, ProtocolConfig } from "@/data/protocols/types";
export type {
  ChainProtocolConfig,
  ContractConfig,
  FunctionConfig,
  FunctionInput,
  TxPreparation,
} from "@/data/protocols/types";

export { AAVE_V3 } from "@/data/protocols/aave-v3";
export { UNISWAP_V3 } from "@/data/protocols/uniswap-v3";
export { COMPOUND_V3 } from "@/data/protocols/compound-v3";
export { AERODROME } from "@/data/protocols/aerodrome";
export { MORPHO } from "@/data/protocols/morpho";
export { MOONWELL } from "@/data/protocols/moonwell";

/**
 * Central protocol registry indexed by DeFiLlama slug.
 * Use this to look up any registered protocol by its unique identifier.
 */
export const PROTOCOL_REGISTRY: Record<string, ProtocolConfig> = {
  [AAVE_V3.slug]: AAVE_V3,
  [UNISWAP_V3.slug]: UNISWAP_V3,
  [COMPOUND_V3.slug]: COMPOUND_V3,
  [AERODROME.slug]: AERODROME,
  [MORPHO.slug]: MORPHO,
  [MOONWELL.slug]: MOONWELL,
};

/**
 * Get a protocol config by its DeFiLlama slug.
 * Returns undefined if the protocol is not registered.
 */
export function getProtocol(slug: string): ProtocolConfig | undefined {
  return PROTOCOL_REGISTRY[slug];
}

/**
 * Get all protocols available on a specific chain.
 * @param chain - The chain slug (e.g., "base", "ethereum")
 * @returns Array of protocols that have deployments on the specified chain
 */
export function getProtocolsByChain(chain: string): ProtocolConfig[] {
  return Object.values(PROTOCOL_REGISTRY).filter(
    (protocol) => chain in protocol.chains
  );
}

/**
 * Get all protocols in a specific category.
 * @param category - The protocol category (e.g., "lending", "dex")
 * @returns Array of protocols matching the specified category
 */
export function getProtocolsByCategory(
  category: ProtocolCategory
): ProtocolConfig[] {
  return Object.values(PROTOCOL_REGISTRY).filter(
    (protocol) => protocol.category === category
  );
}

/**
 * Get all registered protocol slugs.
 * @returns Array of all protocol slug strings
 */
export function getAllProtocolSlugs(): string[] {
  return Object.keys(PROTOCOL_REGISTRY);
}
