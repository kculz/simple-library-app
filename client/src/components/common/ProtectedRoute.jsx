import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAppContext();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check role if specified
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;