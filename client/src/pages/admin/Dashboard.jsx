import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useContext';
import useApi from '../../hooks/useApi';
import { 
  FaBook, 
  FaCalendarAlt, 
  FaClock, 
  FaSearch,
  FaArrowRight
} from 'react-icons/fa';
import BookCard from '../../components/ui/BookCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAppContext();
  const api = useApi();
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    booksBorrowed: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent books for the student's department and courses
        const booksResponse = await api.get('/books/recent', {
          params: {
            department: user.department,
            courses: user.courses?.join(',')
          }
        });
        
        // Fetch student stats (mock data - replace with actual API calls)
        const statsResponse = await api.get(`/students/${user.id}/stats`);
        
        setRecentBooks(booksResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">
          {user.department} Department • {user.level || 'Level 100'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaBook size={20} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Total Books</h3>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        


      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/admin/browse" 
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span>Browse Books</span>
              <FaArrowRight className="text-primary" />
            </div>
          </Link>
          
          <Link 
            to="/admin/courses" 
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span>Course Materials</span>
              <FaArrowRight className="text-primary" />
            </div>
          </Link>
          

        </div>
      </div>

      {/* Recent Books */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recently Added Books</h2>
          <Link 
            to="/admin/browse" 
            className="text-sm text-primary hover:text-primary-dark flex items-center"
          >
            View all <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : recentBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent books found for your courses
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentBooks.slice(0, 4).map(book => (
              <BookCard 
                key={book._id} 
                book={book}
                linkTo={`/admin/books/${book._id}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Course Materials */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Courses</h2>
          <Link 
            to="/admin/courses" 
            className="text-sm text-primary hover:text-primary-dark flex items-center"
          >
            View all <FaArrowRight className="ml-1" size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.courses?.map(course => (
            <Link 
              key={course} 
              to={`/student/courses/${course}`}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{course}</h3>
                  <p className="text-sm text-gray-500">
                    {getCourseName(course)}
                  </p>
                </div>
                <FaBook className="text-primary" />
              </div>
            </Link>
          )) || (
            <div className="text-gray-500">
              No courses registered yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get course names
function getCourseName(code) {
  const courseNames = {
    'CSC101': 'Introduction to Computing',
    'CSC102': 'Programming Fundamentals',
    'EEE101': 'Basic Electrical Engineering',
    // Add more course mappings as needed
  };
  return courseNames[code] || code;
}

export default Dashboard;