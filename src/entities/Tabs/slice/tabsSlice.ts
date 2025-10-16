import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TabsState, TabItem } from '../model/tabs.types';
import { RootState } from 'app/providers/store/config/store';

const initialState: TabsState = {
  panes: [
    { key: 'dashboard', label: 'Главная', closable: false }
  ],
  activeKey: 'dashboard'
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<TabItem>) => {
      const exists = state.panes.find(pane => pane.key === action.payload.key);
      if (!exists) {
        state.panes.push(action.payload);
      }
      state.activeKey = action.payload.key;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const newPanes = state.panes.filter(pane => pane.key !== action.payload);
      state.panes = newPanes;

      // If active tab is closed, switch to last tab
      if (state.activeKey === action.payload) {
        const lastPane = newPanes[newPanes.length - 1];
        state.activeKey = lastPane?.key || 'dashboard';
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeKey = action.payload;
    },
    clearAllTabs: (state) => {
      state.panes = [{ key: 'dashboard', label: 'Главная', closable: false }];
      state.activeKey = 'dashboard';
    }
  }
});

export const { addTab, removeTab, setActiveTab, clearAllTabs } = tabsSlice.actions;

// Selectors
export const selectTabs = (state: RootState) => state.tabs.panes;
export const selectActiveTabKey = (state: RootState) => state.tabs.activeKey;

export default tabsSlice.reducer;
