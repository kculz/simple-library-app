// src/components/layouts/StudentDashboardLayout.jsx
import { Outlet, Link } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';
import { FaBook, FaHome, FaSignOutAlt } from 'react-icons/fa';

const StudentDashboardLayout = () => {
  const { user, logout } = useAppContext();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white p-4">
        <h1 className="text-xl font-bold mb-6">Student Portal</h1>
        
        <nav className="space-y-2">
          <Link to="/student" className="flex items-center p-2 hover:bg-primary-dark rounded">
            <FaHome className="mr-3" /> Dashboard
          </Link>
          <Link to="/student/browse" className="flex items-center p-2 hover:bg-primary-dark rounded">
            <FaBook className="mr-3" /> Browse Books
          </Link>
        </nav>
        
        <div className="mt-auto pt-4 border-t border-primary-dark">
          <button 
            onClick={() => logout()} 
            className="flex items-center p-2 hover:bg-primary-dark rounded w-full"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentDashboardLayout;