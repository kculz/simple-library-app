import { Routes, Route } from 'react-router-dom';
import { useAppContext } from './hooks/useContext';
import { AdminDashboard, HomePage, StudentDashboard } from './pages';
import { 
  LecturerLogin, 
  LoadingSpinner, 
  ProtectedRoute, 
  StudentLogin 
} from './components';
import LandingPage from './pages/home/LandingPage';
import AdminDashboardLayout from './components/layouts/AdminDashboardLayout';
import StudentDashboardLayout from './components/layouts/StudentDashboardLayout'; // You'll need to create this similar to AdminDashboardLayout



function App() {
  const { loading } = useAppContext();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth Routes */}
      <Route path="/auth">
        <Route path="student/login" element={<StudentLogin />} />
        <Route path="lecturer/login" element={<LecturerLogin />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        {/* <Route index element={<AdminBooksPage />} />
        <Route path="books" element={<AdminBooksPage />} />
        <Route path="books/add" element={<AdminAddBookPage />} />
        <Route path="books/edit/:id" element={<AdminEditBookPage />} /> */}
        {/* Add more admin routes as needed */}
      </Route>

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute role="student">
            <StudentDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        {/* <Route index element={<StudentBrowseBooksPage />} />
        <Route path="browse" element={<StudentBrowseBooksPage />} />
        <Route path="books/:id" element={<StudentBookDetailsPage />} /> */}
        {/* Add more student routes as needed */}
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;