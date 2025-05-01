// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAppContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/auth/${role}/login`} state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;