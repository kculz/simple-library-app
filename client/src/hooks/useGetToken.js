import {jwtDecode} from 'jwt-decode';

const useGetToken = () => {
  const getToken = () => {
    return localStorage.getItem('mtrelib_token');
  };

  const decodeToken = (token) => {
    try {
      if (!token) return null;
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const getTokenData = () => {
    const token = getToken();
    return decodeToken(token);
  };

  const setToken = (token) => {
    localStorage.setItem('mtrelib_token', token);
  };

  const removeToken = () => {
    localStorage.removeItem('mtrelib_token');
  };

  return { 
    getToken, 
    setToken, 
    removeToken,
    decodeToken,
    getTokenData
  };
};

export default useGetToken;