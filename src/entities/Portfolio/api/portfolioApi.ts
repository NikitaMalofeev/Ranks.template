import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from 'shared/config/api.config';
import type {
  Portfolio,
  ReferenceData,
  CreatePortfolioDto,
  UpdatePortfolioDto,
  RebalanceRequest,
  RebalanceResponse
} from '../model/types';

export const portfolioApi = {
  // Get general reference data (portfolios, strategies, etc.)
  getReferenceData: async (): Promise<ReferenceData> => {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.GET_REFERENCE_DATA}`
    );
    return response.data;
  },

  // Get all portfolios
  getPortfolios: async (): Promise<Portfolio[]> => {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}`
    );
    return response.data;
  },

  // Get single portfolio by ID
  getPortfolioById: async (id: string | number): Promise<Portfolio> => {
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}${id}/`
    );
    return response.data;
  },

  // Create new portfolio
  createPortfolio: async (data: CreatePortfolioDto): Promise<Portfolio> => {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.CREATE_PORTFOLIO}`,
      data
    );
    return response.data;
  },

  // Update portfolio
  updatePortfolio: async (data: UpdatePortfolioDto): Promise<Portfolio> => {
    const response = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.UPDATE_PORTFOLIO}${data.id}/`,
      data
    );
    return response.data;
  },

  // Delete portfolio
  deletePortfolio: async (id: string | number): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.DELETE_PORTFOLIO}${id}/`
    );
  },

  // Rebalance portfolio
  rebalancePortfolio: async (data: RebalanceRequest): Promise<RebalanceResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.REBALANCE_PORTFOLIO}`,
      data
    );
    return response.data;
  },

  // Duplicate portfolio
  duplicatePortfolio: async (id: string | number): Promise<Portfolio> => {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}${id}/duplicate/`
    );
    return response.data;
  },

  // Toggle portfolio status
  togglePortfolioStatus: async (id: string | number): Promise<Portfolio> => {
    const response = await axios.patch(
      `${API_BASE_URL}${API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS}${id}/toggle-status/`
    );
    return response.data;
  },
};
