// Определяем базовый URL в зависимости от окружения
const environment = import.meta.env.VITE_ENVIRONMENT || 'TEST';
const isProd = environment === 'PROD';

export const API_BASE_URL = isProd
  ? (import.meta.env.VITE_API_BASE_URL_PROD || 'https://autopilotback.ranks.pro/main')
  : (import.meta.env.VITE_API_BASE_URL || 'https://test.webbroker.ranks.pro/main');

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/robo/admin_login/', // Убрали /main (теперь в базовом URL)
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  ROBOADVISING: {
    GET_REFERENCE_DATA: '/roboadvising/get_general_reference_data/', // Убрали /main
    GET_PORTFOLIOS: '/roboadvising/portfolios/', // Убрали /main
    CREATE_PORTFOLIO: '/roboadvising/portfolios/create/', // Убрали /main
    UPDATE_PORTFOLIO: '/roboadvising/portfolios/update/', // Убрали /main
    DELETE_PORTFOLIO: '/roboadvising/portfolios/delete/', // Убрали /main
    REBALANCE_PORTFOLIO: '/roboadvising/portfolios/rebalance/', // Убрали /main
    ADD_MODEL_PORTFOLIO: '/roboadvising/add_robo_menu_enter_model_portfolio/',
    VIEW_MODEL_PORTFOLIO: '/roboadvising/view_robo_menu_enter_model_portfolio/',
    GET_ALL_STRATEGY: '/roboadvising/get_all_strategy/',
    UPDATE_MODEL_PORTFOLIO_ITEM: '/roboadvising/update_item_robo_menu_enter_model_portfolio/',
    CREATE_STRATEGY: '/roboadvising/create_strategy/',
    UPDATE_STRATEGY: '/roboadvising/update_strategy/',
    DELETE_STRATEGY: '/roboadvising/delete_strategy/',
  },
};
