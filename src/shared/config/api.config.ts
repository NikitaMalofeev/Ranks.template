export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://test.webbroker.ranks.pro';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/main/robo/admin_login/',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  ROBOADVISING: {
    GET_REFERENCE_DATA: '/main/roboadvising/get_general_reference_data/',
    GET_PORTFOLIOS: '/main/roboadvising/portfolios/',
    CREATE_PORTFOLIO: '/main/roboadvising/portfolios/create/',
    UPDATE_PORTFOLIO: '/main/roboadvising/portfolios/update/',
    DELETE_PORTFOLIO: '/main/roboadvising/portfolios/delete/',
    REBALANCE_PORTFOLIO: '/main/roboadvising/portfolios/rebalance/',
  },
};
