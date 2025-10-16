import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi, LoginCredentials, LoginResponse } from '../api/userApi';

interface UserState {
  token: string;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  token: '',
  userId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await userApi.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    logout: (state) => {
      state.token = '';
      state.userId = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Unknown error';
        state.isAuthenticated = false;
      });
  },
});

export const { setUserToken, setUserId, logout, clearError } = userSlice.actions;
export default userSlice.reducer;
