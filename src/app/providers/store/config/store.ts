import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from 'entities/User/slice/userSlice';
import menuSettingsReducer from 'entities/MenuSettings/slice/menuSettingsSlice';
import portfolioReducer from 'entities/Portfolio/slice/portfolioSlice';
import tabsReducer from 'entities/Tabs/slice/tabsSlice';

// Конфигурация persist для portfolio - сохраняем только selectedBroker
const portfolioPersistConfig = {
    key: 'portfolio',
    storage,
    whitelist: ['selectedBroker'], // Сохраняем только выбранного брокера, не все данные портфелей
};

const rootReducer = combineReducers({
    user: userReducer,
    menuSettings: menuSettingsReducer,
    portfolio: persistReducer(portfolioPersistConfig, portfolioReducer),
    tabs: tabsReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    // Добавили 'user' чтобы сохранять сессию на 100000 часов
    // Убрали 'portfolio' из whitelist, т.к. он имеет свой собственный persistConfig
    whitelist: ['user', 'menuSettings', 'tabs'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
