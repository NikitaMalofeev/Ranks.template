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

const rootReducer = combineReducers({
    user: userReducer,
    menuSettings: menuSettingsReducer,
    portfolio: portfolioReducer,
    tabs: tabsReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    // Убрали 'user' из whitelist, чтобы при каждой новой сессии запрашивался логин
    whitelist: ['menuSettings', 'portfolio', 'tabs'],
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
