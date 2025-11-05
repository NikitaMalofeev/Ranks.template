export { portfolioApi } from './api/portfolioApi';

// Экспорт enums (они являются значениями, а не только типами)
export { PortfolioType, PortfolioStatus } from './model/types';

// Экспорт типов
export type {
  Portfolio,
  PortfolioInstrument,
  ReferenceData,
  CreatePortfolioDto,
  UpdatePortfolioDto,
  RebalanceRequest,
  RebalanceResponse,
  BrokerType,
} from './model/types';

// Экспорт Redux actions и selectors
export {
  fetchReferenceData,
  fetchPortfolios,
  fetchGroupPortfolios,
  fetchPortfolioById,
  deletePortfolio,
  togglePortfolioStatus,
  createStrategy,
  updateStrategy,
  deleteStrategyThunk,
  setFilters,
  resetFilters,
  clearError,
  setSelectedPortfolio,
  setSelectedBroker,
  selectPortfolios,
  selectReferenceData,
  selectSelectedPortfolio,
  selectSelectedBroker,
  selectPortfolioLoading,
  selectPortfolioError,
  selectPortfolioFilters,
  selectFilteredPortfolios,
} from './slice/portfolioSlice';
