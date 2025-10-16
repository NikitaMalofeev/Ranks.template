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
