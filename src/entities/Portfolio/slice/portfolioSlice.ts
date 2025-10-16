import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { portfolioApi } from '../api/portfolioApi';
import type {
  Portfolio,
  ReferenceData,
  PortfolioType,
  PortfolioStatus
} from '../model/types';
import type { RootState } from 'app/providers/store/config/store';

interface PortfolioState {
  portfolios: Portfolio[];
  referenceData: ReferenceData | null;
  selectedPortfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  filters: {
    type: PortfolioType | 'all';
    status: PortfolioStatus | 'all';
    search: string;
    profitRange: [number, number];
  };
}

const initialState: PortfolioState = {
  portfolios: [],
  referenceData: null,
  selectedPortfolio: null,
  loading: false,
  error: null,
  filters: {
    type: 'all',
    status: 'all',
    search: '',
    profitRange: [-100, 200],
  },
};

// Async thunks
export const fetchReferenceData = createAsyncThunk(
  'portfolio/fetchReferenceData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await portfolioApi.getReferenceData();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки справочных данных');
    }
  }
);

export const fetchPortfolios = createAsyncThunk(
  'portfolio/fetchPortfolios',
  async (_, { rejectWithValue }) => {
    try {
      const portfolios = await portfolioApi.getPortfolios();
      return portfolios;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки портфелей');
    }
  }
);

export const fetchPortfolioById = createAsyncThunk(
  'portfolio/fetchPortfolioById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const portfolio = await portfolioApi.getPortfolioById(id);
      return portfolio;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка загрузки портфеля');
    }
  }
);

export const deletePortfolio = createAsyncThunk(
  'portfolio/deletePortfolio',
  async (id: string | number, { rejectWithValue }) => {
    try {
      await portfolioApi.deletePortfolio(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка удаления портфеля');
    }
  }
);

export const togglePortfolioStatus = createAsyncThunk(
  'portfolio/togglePortfolioStatus',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const portfolio = await portfolioApi.togglePortfolioStatus(id);
      return portfolio;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка изменения статуса');
    }
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<PortfolioState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPortfolio: (state, action: PayloadAction<Portfolio | null>) => {
      state.selectedPortfolio = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch reference data
    builder
      .addCase(fetchReferenceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.loading = false;
        state.referenceData = action.payload;
      })
      .addCase(fetchReferenceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch portfolios
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = action.payload;
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch portfolio by ID
    builder
      .addCase(fetchPortfolioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolioById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPortfolio = action.payload;
      })
      .addCase(fetchPortfolioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete portfolio
    builder
      .addCase(deletePortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.portfolios = state.portfolios.filter(p => p.id !== action.payload);
      })
      .addCase(deletePortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle portfolio status
    builder
      .addCase(togglePortfolioStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePortfolioStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.portfolios.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.portfolios[index] = action.payload;
        }
      })
      .addCase(togglePortfolioStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, clearError, setSelectedPortfolio } = portfolioSlice.actions;

// Selectors
export const selectPortfolios = (state: RootState) => state.portfolio.portfolios;
export const selectReferenceData = (state: RootState) => state.portfolio.referenceData;
export const selectSelectedPortfolio = (state: RootState) => state.portfolio.selectedPortfolio;
export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;
export const selectPortfolioError = (state: RootState) => state.portfolio.error;
export const selectPortfolioFilters = (state: RootState) => state.portfolio.filters;

// Filtered portfolios selector
export const selectFilteredPortfolios = (state: RootState) => {
  const { portfolios, filters } = state.portfolio;

  return portfolios.filter((portfolio) => {
    // Filter by type
    if (filters.type !== 'all' && portfolio.type !== filters.type) {
      return false;
    }

    // Filter by status
    if (filters.status !== 'all' && portfolio.status !== filters.status) {
      return false;
    }

    // Filter by search
    if (filters.search && !portfolio.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Filter by profit range
    if (
      portfolio.profitLossPercent < filters.profitRange[0] ||
      portfolio.profitLossPercent > filters.profitRange[1]
    ) {
      return false;
    }

    return true;
  });
};

export default portfolioSlice.reducer;
