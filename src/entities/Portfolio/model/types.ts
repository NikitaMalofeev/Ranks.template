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

// Brand information for instruments
export interface InstrumentBrand {
  logo_base_color?: string;
  logo_name?: string;
  text_color?: string;
}

// Detailed API data for instruments
export interface InstrumentApiData {
  api_trade_available_flag?: boolean;
  asset_uid?: string;
  blocked_tca_flag?: boolean;
  brand?: InstrumentBrand;
  buy_available_flag?: boolean;
  class_code?: string;
  country_of_risk?: string;
  country_of_risk_name?: string;
  currency?: string;
  div_yield_flag?: boolean;
  dlong?: MoneyValue;
  dlong_min?: MoneyValue;
  dshort?: MoneyValue;
  dshort_min?: MoneyValue;
  exchange?: string;
  figi?: string;
  first_1day_candle_date?: string;
  first_1min_candle_date?: string;
  for_iis_flag?: boolean;
  for_qual_investor_flag?: boolean;
  instrument_exchange?: number;
  ipo_date?: string;
  isin?: string;
  issue_size?: number;
  issue_size_plan?: number;
  klong?: MoneyValue;
  kshort?: MoneyValue;
  liquidity_flag?: boolean;
  lot?: number;
  min_price_increment?: MoneyValue;
  name?: string;
  nominal?: MoneyValue;
  otc_flag?: boolean;
  position_uid?: string;
  real_exchange?: number;
  sector?: string;
  sell_available_flag?: boolean;
  share_type?: number;
  short_enabled_flag?: boolean;
  ticker?: string;
  trading_status?: number;
  uid?: string;
  weekend_flag?: boolean;
}

// Model portfolio position with full data
export interface ModelPortfolioPosition {
  id: number;
  is_active: boolean;
  isin: string;
  share: number;
  strategy: number;
  created: string;
  modified: string;
  data_api: InstrumentApiData;
}

// Response format from view_robo_menu_enter_model_portfolio
export interface ViewModelPortfolioResponse {
  [isin: string]: ModelPortfolioPosition;
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
  full_name: string; // Full name with number prefix (e.g., "1F - Сша стандарт")
  description: string;
  market: MarketType; // Market type from backend
  instrument: InstrumentType; // Instrument type from backend
  is_active: boolean; // Active status from backend
  created: string; // Creation date from backend (ISO 8601)
  modified: string; // Modification date from backend (ISO 8601)
}

export interface UpdateModelPortfolioItemRequest {
  id_item: number;
  edit_share: number;
}

// Broker types
export type BrokerType = 'tradernet_ff' | 'tinkoff_brokers' | 'finam_broker';

// Response from get_group_portfolios API
export interface MoneyValue {
  currency?: string; // Optional, not present in all cases (e.g., average_position_price_pt, expected_yield)
  nano: number;
  units: number;
}

export interface PortfolioPosition {
  average_position_price: MoneyValue;
  average_position_price_fifo: MoneyValue;
  average_position_price_pt: MoneyValue;
  blocked: boolean;
  blocked_lots: MoneyValue;
  current_nkd: MoneyValue;
  current_price: MoneyValue;
  expected_yield: MoneyValue;
  expected_yield_fifo: MoneyValue;
  figi: string;
  instrument_type: string;
  instrument_uid: string;
  position_uid: string;
  quantity: MoneyValue;
  quantity_lots: MoneyValue;
  var_margin: MoneyValue;
}

export interface GroupPortfoliosResponse {
  count: number;
  data: {
    [portfolioId: string]: PortfolioPosition[];
  };
}
