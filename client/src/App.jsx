import { Routes, Route } from 'react-router-dom';
import { useAppContext } from './hooks/useContext';
import { AdminDashboard, HomePage, StudentDashboard } from './pages';
import { LoadingSpinner, ProtectedRoute } from './components';


function App() {
  const { loading } = useAppContext();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;