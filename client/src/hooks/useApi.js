import axios from 'axios';
import useGetToken from './useGetToken';

const useApi = () => {
  const { getToken, getTokenData, removeToken } = useGetToken();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  });

  // Request interceptor
  api.interceptors.request.use((config) => {
    const token = getToken();
    const tokenData = getTokenData();

    // Check if token is expired
    if (tokenData && tokenData.exp * 1000 < Date.now()) {
      removeToken();
      return Promise.reject(new Error('Token expired'));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeToken();
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useApi;