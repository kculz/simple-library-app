import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';
import { 
  FaBook, 
  FaPlus, 
  FaUsers, 
  FaSignOutAlt, 
  FaBars,
  FaTimes,
  FaHome,
  FaCog
} from 'react-icons/fa';

const AdminDashboardLayout = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin' },
    { name: 'Books', icon: <FaBook />, path: '/admin/books' },
    { name: 'Add Book', icon: <FaPlus />, path: '/admin/books/add' },
    { name: 'Students', icon: <FaUsers />, path: '/admin/students' },
    { name: 'Settings', icon: <FaCog />, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:static z-30 w-64 bg-primary text-white transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-primary-dark">
            <h1 className="text-xl font-bold">Mtre Poly Admin</h1>
            <button 
              className="lg:hidden text-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-4 border-b border-primary-dark">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-primary-light">Lecturer</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="flex items-center p-3 rounded-lg hover:bg-primary-dark transition-colors"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-primary-dark">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <span className="mr-3"><FaSignOutAlt /></span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button 
              className="lg:hidden text-gray-500"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <FaBars />
            </button>
            
            <button 
              className="hidden lg:block text-gray-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </span>
                <button className="text-gray-500">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;