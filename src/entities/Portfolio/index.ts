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
  ModelPortfolioItem,
  ModelPortfolioPosition,
  ViewModelPortfolioRequest,
  ViewModelPortfolioResponse,
  Strategy,
  InstrumentApiData,
  InstrumentBrand,
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
  viewModelPortfolio,
  fetchAllStrategies,
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
  selectModelPortfolio,
  selectStrategies,
} from './slice/portfolioSlice';
