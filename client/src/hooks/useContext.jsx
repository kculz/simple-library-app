import { createContext, useContext, useState, useEffect } from 'react';
import useGetToken from './useGetToken';
import useApi from './useApi';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { getToken } = useGetToken();
  const api = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          // Verify token with backend or Firebase
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          console.error('Auth verification failed:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData, token) => {
    localStorage.setItem('mtrelib_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('mtrelib_token');
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, loading, login, logout, api }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);