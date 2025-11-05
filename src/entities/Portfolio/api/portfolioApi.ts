import { apiClient } from 'shared/api/axios.config';
import { API_ENDPOINTS } from 'shared/config/api.config';
import type {
  Portfolio,
  ReferenceData,
  CreatePortfolioDto,
  UpdatePortfolioDto,
  RebalanceRequest,
  RebalanceResponse,
  AddModelPortfolioRequest,
  ViewModelPortfolioRequest,
  ViewModelPortfolioResponse,
  Strategy,
  UpdateModelPortfolioItemRequest
} from '../model/types';

export const portfolioApi = {
  // Get general reference data (portfolios, strategies, etc.)
  // Токен автоматически добавляется через axios interceptor
  getReferenceData: async (): Promise<ReferenceData> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.GET_REFERENCE_DATA,
      {} // POST requires body, even if empty
    );
    return response.data;
  },

  // Get all portfolios
  getPortfolios: async (): Promise<Portfolio[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS
    );
    return response.data;
  },

  // Get single portfolio by ID
  getPortfolioById: async (id: string | number): Promise<Portfolio> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}${id}/`
    );
    return response.data;
  },

  // Create new portfolio
  createPortfolio: async (data: CreatePortfolioDto): Promise<Portfolio> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.CREATE_PORTFOLIO,
      data
    );
    return response.data;
  },

  // Update portfolio
  updatePortfolio: async (data: UpdatePortfolioDto): Promise<Portfolio> => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.ROBOADVISING.UPDATE_PORTFOLIO}${data.id}/`,
      data
    );
    return response.data;
  },

  // Delete portfolio
  deletePortfolio: async (id: string | number): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.ROBOADVISING.DELETE_PORTFOLIO}${id}/`
    );
  },

  // Rebalance portfolio
  rebalancePortfolio: async (data: RebalanceRequest): Promise<RebalanceResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.REBALANCE_PORTFOLIO,
      data
    );
    return response.data;
  },

  // Duplicate portfolio
  duplicatePortfolio: async (id: string | number): Promise<Portfolio> => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}${id}/duplicate/`
    );
    return response.data;
  },

  // Toggle portfolio status
  togglePortfolioStatus: async (id: string | number): Promise<Portfolio> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}${id}/toggle-status/`
    );
    return response.data;
  },

  // Add model portfolio
  addModelPortfolio: async (data: AddModelPortfolioRequest): Promise<any> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.ADD_MODEL_PORTFOLIO,
      data
    );
    return response.data;
  },

  // View model portfolio
  viewModelPortfolio: async (data: ViewModelPortfolioRequest): Promise<ViewModelPortfolioResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.VIEW_MODEL_PORTFOLIO,
      data
    );
    return response.data;
  },

  // Get all strategies
  getAllStrategies: async (): Promise<Strategy[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.ROBOADVISING.GET_ALL_STRATEGY
    );
    return response.data;
  },

  // Update model portfolio item
  updateModelPortfolioItem: async (data: UpdateModelPortfolioItemRequest): Promise<any> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.UPDATE_MODEL_PORTFOLIO_ITEM,
      data
    );
    return response.data;
  },

  // Create strategy
  createStrategy: async (data: Partial<Strategy>): Promise<Strategy> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.CREATE_STRATEGY,
      data
    );
    return response.data;
  },

  // Update strategy
  updateStrategy: async (id: number, data: Partial<Strategy>): Promise<Strategy> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.UPDATE_STRATEGY,
      { id, ...data }
    );
    return response.data;
  },

  // Delete strategy
  deleteStrategy: async (id: number): Promise<void> => {
    await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.DELETE_STRATEGY,
      { id }
    );
  },
};
