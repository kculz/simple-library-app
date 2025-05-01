import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useContext';
import useApi from '../../hooks/useApi';
import { FaBook, FaSearch, FaFilter } from 'react-icons/fa';
import { BookCard, LoadingSpinner, Select } from '../../components';

const StudentDashboard = () => {
  const { user } = useAppContext();
  const api = useApi();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    courseCode: user.courses?.[0] || '',
    department: user.department || 'computer-science',
    bookType: 'course' // 'course' or 'general'
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = { 
        department: filters.department,
        ...(filters.courseCode && filters.bookType === 'course' && { courseCode: filters.courseCode }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await api.get('/books', { params });
      setBooks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters, searchTerm]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary mb-2">Welcome, {user.name}</h1>
        <p className="text-gray-600">
          Browse books for your {user.department} department
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Department"
            Icon={FaFilter}
            value={filters.department}
            onChange={(value) => handleFilterChange('department', value)}
            options={[
              { value: 'computer-science', label: 'Computer Science' },
              { value: 'electrical', label: 'Electrical Engineering' },
              { value: 'mechanical', label: 'Mechanical Engineering' },
            ]}
          />

          <Select
            label="Course"
            Icon={FaBook}
            value={filters.courseCode}
            onChange={(value) => handleFilterChange('courseCode', value)}
            options={[
              { value: '', label: 'All Courses' },
              ...(user.courses?.map(course => ({
                value: course,
                label: `${course} - ${getCourseName(course)}`
              })) || []),
            ]}
          />

          <Select
            label="Book Type"
            Icon={FaFilter}
            value={filters.bookType}
            onChange={(value) => handleFilterChange('bookType', value)}
            options={[
              { value: 'course', label: 'Course Books' },
              { value: 'general', label: 'General Books' },
            ]}
          />
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {filters.bookType === 'course' 
            ? filters.courseCode 
              ? `Books for ${filters.courseCode}`
              : 'Course Books'
            : 'General Library Books'}
        </h2>
        <span className="text-sm text-gray-500">
          {books.length} {books.length === 1 ? 'book' : 'books'} found
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          {error}
        </div>
      ) : books.length === 0 ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
          No books found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book._id} 
              book={book} 
              linkTo={`/student/books/${book._id}`}
            />
          ))}
        </div>
      )}
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

export default StudentDashboard;