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


export default StudentDashboard;