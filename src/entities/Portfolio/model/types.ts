// Portfolio types based on TZ requirements

export enum PortfolioType {
  AGGRESSIVE = 'AGGRESSIVE',
  MODERATE = 'MODERATE',
  CONSERVATIVE = 'CONSERVATIVE',
  BALANCED = 'BALANCED'
}

export enum PortfolioStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT'
}

export interface PortfolioInstrument {
  ticker: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  weightPercent: number;
  targetWeightPercent: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface Portfolio {
  id: string | number;
  name: string;
  description?: string;
  type: PortfolioType;
  status: PortfolioStatus;
  instrumentsCount: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
  targetReturn: number;
  maxDrawdown: number;
  createdAt: string;
  updatedAt: string;
  lastRebalance?: string;
  instruments: PortfolioInstrument[];

  // Risk metrics
  volatility?: number;
  sharpeRatio?: number;
  var95?: number;
}

export interface ReferenceData {
  // Структура будет уточнена после получения данных от API
  portfolios?: Portfolio[];
  strategies?: any[];
  instruments?: any[];
  [key: string]: any;
}

export interface CreatePortfolioDto {
  name: string;
  description?: string;
  type: PortfolioType;
  targetReturn?: number;
  maxDrawdown?: number;
  instruments: {
    ticker: string;
    quantity: number;
    weightPercent: number;
  }[];
  autoRebalance?: boolean;
  rebalanceFrequency?: string;
  rebalanceThreshold?: number;
}

export interface UpdatePortfolioDto extends Partial<CreatePortfolioDto> {
  id: string | number;
}

export interface RebalanceRequest {
  portfolioId: string | number;
  forced?: boolean;
}

export interface RebalanceResponse {
  changes: {
    ticker: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    currentWeight: number;
    targetWeight: number;
  }[];
  estimatedCost: number;
}

// Model Portfolio types
export interface ModelPortfolioItem {
  is_active: boolean;
  isin: string;
  share: number;
}

export interface AddModelPortfolioRequest {
  id_strategy: number;
  items: ModelPortfolioItem[];
}

export interface ViewModelPortfolioRequest {
  id_strategy: number;
}

export interface ViewModelPortfolioResponse {
  id_strategy: number;
  items: ModelPortfolioItem[];
}

export type StrategyType = 'russian' | 'global' | 'mixed';

// Market types from backend
export type MarketType = 'market_robo_usa' | 'market_robo_russian';

// Instrument types from backend
export type InstrumentType = 'instrument_bonds' | 'instrument_shares';

export interface Strategy {
  id: number;
  name: string;
  number: string; // Strategy number (e.g., "1F", "2F", "3S")
  description?: string;
  type?: StrategyType;
  market: MarketType; // Market type from backend
  instrument: InstrumentType; // Instrument type from backend
  is_active: boolean; // Active status from backend
  created?: string; // Creation date from backend
  modified?: string; // Modification date from backend
  isActive?: boolean; // For compatibility
  profitability?: number;
  risk?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface UpdateModelPortfolioItemRequest {
  id_item: number;
  edit_share: number;
}
