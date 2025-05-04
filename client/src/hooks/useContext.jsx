import { createContext, useContext, useState, useEffect } from 'react';
import useGetToken from './useGetToken';
import useApi from './useApi';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { getToken, setToken, removeToken, getTokenData } = useGetToken();
  const api = useApi();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on initial load
  useEffect(() => {
    const tokenData = getTokenData();
    if (tokenData) {
      setUser({
        id: tokenData.userId,
        role: tokenData.role,
        name: tokenData.name,
        email: tokenData.email
        // Add other user properties from token as needed
      });
    }
    setLoading(false);
  }, []);

  const login = async (userData, token) => {
    setToken(token);
    const tokenData = getTokenData();
    setUser({
      id: tokenData.userId,
      role: tokenData.role,
      name: tokenData.name,
      email: tokenData.email,
      ...userData
    });
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  // Get current user role
  const getUserRole = () => {
    return user?.role;
  };

  // Get current user ID
  const getUserId = () => {
    return user?.id;
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      api,
      getUserRole,
      getUserId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);