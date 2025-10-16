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
} from './model/types';

// Экспорт Redux actions и selectors
export {
  fetchReferenceData,
  fetchPortfolios,
  fetchPortfolioById,
  deletePortfolio,
  togglePortfolioStatus,
  setFilters,
  resetFilters,
  clearError,
  setSelectedPortfolio,
  selectPortfolios,
  selectReferenceData,
  selectSelectedPortfolio,
  selectPortfolioLoading,
  selectPortfolioError,
  selectPortfolioFilters,
  selectFilteredPortfolios,
} from './slice/portfolioSlice';
