import axios from 'axios';
import useGetToken from './useGetToken';

const useApi = () => {
  const { getToken } = useGetToken();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  });

  // Request interceptor for adding auth token
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

export default useApi;