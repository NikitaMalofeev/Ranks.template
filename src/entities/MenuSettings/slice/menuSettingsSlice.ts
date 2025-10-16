import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { MenuSettingsState, MenuItem } from '../types/menuSettings.types';
import { RootState } from 'app/providers/store/config/store';

const initialState: MenuSettingsState = {
  menuItems: [
    { key: 'dashboard', label: 'Главная', visible: true, order: 1 },
    { key: 'personal-cabinet', label: 'Личный кабинет', visible: true, order: 2 },
    { key: 'executions', label: 'Исполнения', visible: true, order: 3 },
    { key: 'strategies', label: 'Стратегии', visible: true, order: 4 },
    { key: 'portfolio-input', label: 'Ввод модельного портфеля', visible: true, order: 5 },
    { key: 'risk-profile', label: 'Риск профили', visible: true, order: 6 },
    { key: 'quik', label: 'QUIK', visible: true, order: 7 },
    { key: 'reports', label: 'Отчеты', visible: false, order: 8 },
    { key: 'settings', label: 'Настройки', visible: true, order: 9 },
  ],
  openKeys: [],
};

const menuSettingsSlice = createSlice({
  name: 'menuSettings',
  initialState,
  reducers: {
    toggleMenuItem: (state, action: PayloadAction<string>) => {
      const item = state.menuItems.find(i => i.key === action.payload);
      if (item && item.key !== 'dashboard') { // Dashboard всегда видим
        item.visible = !item.visible;
      }
    },
    reorderMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.menuItems.push(action.payload);
    },
    removeMenuItem: (state, action: PayloadAction<string>) => {
      if (action.payload !== 'dashboard') { // Dashboard нельзя удалить
        state.menuItems = state.menuItems.filter(i => i.key !== action.payload);
      }
    },
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload;
    },
    resetMenuSettings: (state) => {
      state.menuItems = initialState.menuItems;
      state.openKeys = initialState.openKeys;
    },
  },
});

export const {
  toggleMenuItem,
  reorderMenuItems,
  addMenuItem,
  removeMenuItem,
  setOpenKeys,
  resetMenuSettings,
} = menuSettingsSlice.actions;

// Selectors
export const selectMenuItems = (state: RootState) => state.menuSettings.menuItems;
export const selectOpenKeys = (state: RootState) => state.menuSettings.openKeys;

// Мемоизированный селектор для видимых пунктов меню
export const selectVisibleMenuItems = createSelector(
  [selectMenuItems],
  (menuItems) => menuItems.filter(item => item.visible).sort((a, b) => a.order - b.order)
);

export default menuSettingsSlice.reducer;
