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
  UpdateModelPortfolioItemRequest,
  BrokerType,
  GroupPortfoliosResponse,
  PortfolioPosition,
  MoneyValue
} from '../model/types';

// Helper function to convert MoneyValue to number
const moneyValueToNumber = (value: MoneyValue): number => {
  return value.units + value.nano / 1_000_000_000;
};

// Helper function to transform GroupPortfoliosResponse to Portfolio[]
const transformGroupPortfoliosToPortfolios = (response: GroupPortfoliosResponse): Portfolio[] => {
  const portfolios: Portfolio[] = [];

  Object.entries(response.data).forEach(([portfolioId, positions]) => {
    // Calculate portfolio metrics from positions
    let totalValue = 0;
    let totalProfitLoss = 0;
    const instruments = positions.map(position => {
      const quantity = moneyValueToNumber(position.quantity);
      const currentPrice = moneyValueToNumber(position.current_price);
      const averagePrice = moneyValueToNumber(position.average_position_price);
      const positionValue = quantity * currentPrice;
      const positionCost = quantity * averagePrice;
      const profitLoss = positionValue - positionCost;

      totalValue += positionValue;
      totalProfitLoss += profitLoss;

      return {
        ticker: position.figi,
        name: position.figi, // FIGI используется как имя, можно улучшить
        quantity,
        purchasePrice: averagePrice,
        currentPrice,
        weightPercent: 0, // Будет пересчитано после
        targetWeightPercent: 0, // Неизвестно из API
        profitLoss,
        profitLossPercent: positionCost > 0 ? (profitLoss / positionCost) * 100 : 0
      };
    });

    // Recalculate weight percentages
    instruments.forEach(instrument => {
      instrument.weightPercent = totalValue > 0
        ? (instrument.quantity * instrument.currentPrice / totalValue) * 100
        : 0;
    });

    const profitLossPercent = totalValue > 0 ? (totalProfitLoss / (totalValue - totalProfitLoss)) * 100 : 0;

    portfolios.push({
      id: portfolioId,
      name: `Портфель ${portfolioId.substring(0, 8)}`,
      type: 'BALANCED' as any, // Тип неизвестен из API
      status: 'ACTIVE' as any,
      instrumentsCount: positions.length,
      totalValue,
      profitLoss: totalProfitLoss,
      profitLossPercent,
      targetReturn: 0,
      maxDrawdown: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      instruments
    });
  });

  return portfolios;
};

export const portfolioApi = {
  // Get general reference data (portfolios, strategies, etc.)
  // Токен автоматически добавляется через axios interceptor
  getReferenceData: async (broker: BrokerType): Promise<ReferenceData> => {
    const response = await apiClient.post(
      API_ENDPOINTS.ROBOADVISING.GET_REFERENCE_DATA,
      { broker } // Передаем broker в теле запроса
    );
    return response.data;
  },

  // Get all portfolios (old endpoint - deprecated)
  getPortfolios: async (): Promise<Portfolio[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.ROBOADVISING.GET_PORTFOLIOS
    );
    return response.data;
  },

  // Get group portfolios by broker (new endpoint)
  getGroupPortfolios: async (broker: BrokerType): Promise<Portfolio[]> => {
    const response = await apiClient.post<GroupPortfoliosResponse>(
      API_ENDPOINTS.ROBOADVISING.GET_GROUP_PORTFOLIOS,
      { broker }
    );
    return transformGroupPortfoliosToPortfolios(response.data);
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
