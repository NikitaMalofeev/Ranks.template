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
  },
};
