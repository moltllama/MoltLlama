/** Protocol summary from /protocols endpoint */
export interface DefiLlamaProtocol {
  id: string;
  name: string;
  slug: string;
  chains: string[];
  tvl: number;
  change_1h: number | null;
  change_1d: number | null;
  change_7d: number | null;
  category: string;
  url: string;
  logo: string;
  symbol: string;
  cmcId: string | null;
  description: string;
  chain: string;
  chainTvls: Record<string, number>;
  staking?: number;
  pool2?: number;
  mcap?: number;
  fdv?: number;
  forkedFrom?: string[];
  audits?: string;
  audit_links?: string[];
  openSource?: boolean;
  listedAt?: number;
  parentProtocol?: string;
}

/** Detailed protocol from /protocol/{slug} endpoint */
export interface DefiLlamaProtocolDetail {
  id: string;
  name: string;
  slug: string;
  chains: string[];
  tvl: ChainTvlEntry[];
  chainTvls: Record<string, { tvl: ChainTvlEntry[]; tokens?: TokenTvlEntry[]; tokensInUsd?: TokenTvlEntry[] }>;
  currentChainTvls: Record<string, number>;
  tokens?: TokenTvlEntry[];
  tokensInUsd?: TokenTvlEntry[];
  category: string;
  url: string;
  logo: string;
  symbol: string;
  description: string;
  methodology?: string;
  misrepresentedTokens?: boolean;
  hallpiernacks?: boolean;
  audit_links?: string[];
  forkedFrom?: string[];
  mcap?: number;
  raises?: ProtocolRaise[];
}

/** TVL entry with date */
export interface ChainTvlEntry {
  date: number;
  tvl: number;
}

/** Token TVL entry with date and per-token breakdown */
export interface TokenTvlEntry {
  date: number;
  tokens: Record<string, number>;
}

/** Protocol fundraise info */
export interface ProtocolRaise {
  date: string;
  amount: number;
  round: string;
  leadInvestors?: string[];
  otherInvestors?: string[];
  valuation?: number;
}

/** Token price from coins.llama.fi */
export interface TokenPrice {
  price: number;
  symbol: string;
  timestamp: number;
  confidence: number;
  decimals?: number;
  address?: string;
}

/** Token prices response keyed by coin identifier */
export interface TokenPricesResponse {
  coins: Record<string, TokenPrice>;
}

/** Individual DEX volume protocol entry */
export interface DexVolumeProtocol {
  defillamaId: string;
  name: string;
  slug: string;
  category: string;
  logo: string;
  chains: string[];
  total24h: number | null;
  total48hto24h: number | null;
  total7d: number | null;
  total30d: number | null;
  totalAllTime: number | null;
  change_1d: number | null;
  change_7d: number | null;
  change_1m: number | null;
  change_7dover7d: number | null;
  methodologyURL?: string;
  methodology?: Record<string, string>;
}

/** DEX volume overview from /overview/dexs */
export interface DexVolumeOverview {
  protocols: DexVolumeProtocol[];
  total24h: number;
  total48hto24h: number;
  total7d: number;
  total30d: number;
  totalDataChart: [number, number][];
  totalDataChartBreakdown: Record<string, Record<string, number>>[];
  change_1d: number;
  change_7d: number;
  change_1m: number;
  allChains: string[];
}

/** Individual fee protocol entry */
export interface FeeProtocol {
  defillamaId: string;
  name: string;
  slug: string;
  category: string;
  logo: string;
  chains: string[];
  total24h: number | null;
  total48hto24h: number | null;
  total7d: number | null;
  total30d: number | null;
  totalAllTime: number | null;
  change_1d: number | null;
  change_7d: number | null;
  change_1m: number | null;
  revenue24h?: number | null;
  revenue7d?: number | null;
  revenue30d?: number | null;
}

/** Fee overview from /overview/fees */
export interface FeeOverview {
  protocols: FeeProtocol[];
  total24h: number;
  total48hto24h: number;
  total7d: number;
  total30d: number;
  totalDataChart: [number, number][];
  totalDataChartBreakdown: Record<string, Record<string, number>>[];
  change_1d: number;
  change_7d: number;
  change_1m: number;
  allChains: string[];
}

/** Yield pool from yields/pools endpoint */
export interface YieldPool {
  pool: string;              // unique pool uuid
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  rewardTokens: string[] | null;
  underlyingTokens: string[] | null;
  il7d: number | null;
  apyBase7d: number | null;
  apyMean30d: number | null;
  volumeUsd1d: number | null;
  volumeUsd7d: number | null;
  stablecoin: boolean;
  ilRisk: string | null;
  exposure: string | null;
  poolMeta: string | null;
  mu: number | null;
  sigma: number | null;
  count: number | null;
  outlier: boolean | null;
  predictions: {
    predictedClass: string | null;
    predictedProbability: number | null;
    binnedConfidence: number | null;
  } | null;
}

/** Borrow pool extends yield pool with borrowing fields */
export interface BorrowPool extends YieldPool {
  apyBaseBorrow: number | null;
  apyRewardBorrow: number | null;
  totalSupplyUsd: number | null;
  totalBorrowUsd: number | null;
  debtCeilingUsd: number | null;
  ltv: number | null;
  borrowable: boolean;
  mintedCoin: string | null;
  borrowFactor: number | null;
}

/** Yields/pools API response */
export interface YieldPoolsResponse {
  status: string;
  data: YieldPool[];
}
