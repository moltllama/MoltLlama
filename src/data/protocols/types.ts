export type ProtocolCategory =
  | "lending"
  | "dex"
  | "yield"
  | "bridge"
  | "derivatives"
  | "staking"
  | "cdp";

export interface FunctionInput {
  name: string;
  type: string;
  description: string;
}

export interface TxPreparation {
  requiresApproval: boolean;
  approvalTarget?: string;
  gasEstimate: number;
  notes: string[];
}

export interface FunctionConfig {
  name: string;
  signature: string;
  selector: string;
  description: string;
  inputs: FunctionInput[];
  txPreparation?: TxPreparation;
}

export interface ContractConfig {
  name: string;
  address: string;
  purpose: string;
  keyFunctions: FunctionConfig[];
  explorerUrl: string;
}

export interface ChainProtocolConfig {
  contracts: ContractConfig[];
  supportedTokens: string[];
}

export interface ProtocolConfig {
  slug: string;
  name: string;
  category: ProtocolCategory;
  description: string;
  logo: string;
  website: string;
  docs?: string;
  github?: string;
  chains: Record<string, ChainProtocolConfig>;
}
