const useGetToken = () => {
    const getToken = () => {
      return localStorage.getItem('mtrelib_token');
    };
  
    const setToken = (token) => {
      localStorage.setItem('mtrelib_token', token);
    };
  
    const removeToken = () => {
      localStorage.removeItem('mtrelib_token');
    };
  
    return { getToken, setToken, removeToken };
  };
  
  export default useGetToken;