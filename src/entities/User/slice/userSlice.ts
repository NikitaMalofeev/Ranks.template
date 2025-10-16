import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string;
  userId: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  token: '',
  userId: null,
  isAuthenticated: false,
};

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
    },
  },
});

export const { setUserToken, setUserId, logout } = userSlice.actions;
export default userSlice.reducer;
