// components/books/BookList.js
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useContext';
import { FaFilter, FaPlus, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BookCard, Button, Select } from '../../components';

const BookList = () => {
  const { api, user } = useAppContext();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    class: '',
    level: '',
    module: '',
    available: true
  });
  const [filterOptions, setFilterOptions] = useState({
    classes: [],
    levels: [],
    modules: []
  });

  // Fetch books and filter options
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch filter options
        const optionsResponse = await api.get('/classes/filters');
        setFilterOptions(optionsResponse.data);

        // Fetch books
        const booksResponse = await api.get('/books');
        setBooks(booksResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch books when filters change
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (filters.class) params.class = filters.class;
        if (filters.level) params.level = filters.level;
        if (filters.module) params.module = filters.module;
        if (filters.available !== undefined) params.available = filters.available;

        const response = await api.get('/books', { params });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent filters
      ...(name === 'class' && { level: '', module: '' }),
      ...(name === 'level' && { module: '' })
    }));
  };

  const getFilteredLevels = () => {
    if (!filters.class) return filterOptions.levels;
    return filterOptions.levels.filter(l => 
      l.classes.includes(filters.class)
    );
  };

  const getFilteredModules = () => {
    if (!filters.class && !filters.level) return filterOptions.modules;
    
    return filterOptions.modules.filter(m => {
      const matchesClass = !filters.class || m.class === filters.class;
      const matchesLevel = !filters.level || m.level === filters.level;
      return matchesClass && matchesLevel;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Library Books</h1>
        {user.role === 'admin' && (
          <Button
            onClick={() => navigate('/admin/books/add')}
            Icon={FaPlus}
          >
            Add New Book
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Class"
            value={filters.class}
            onChange={(value) => handleFilterChange('class', value)}
            options={[
              { value: '', label: 'All Classes' },
              ...filterOptions.classes.map(c => ({
                value: c._id,
                label: c.name
              }))
            ]}
          />

          <Select
            label="Level"
            value={filters.level}
            onChange={(value) => handleFilterChange('level', value)}
            options={[
              { value: '', label: 'All Levels' },
              ...getFilteredLevels().map(l => ({
                value: l._id,
                label: l.name
              }))
            ]}
            disabled={!filters.class}
          />

          <Select
            label="Module"
            value={filters.module}
            onChange={(value) => handleFilterChange('module', value)}
            options={[
              { value: '', label: 'All Modules' },
              ...getFilteredModules().map(m => ({
                value: m._id,
                label: m.name
              }))
            ]}
            disabled={!filters.class || !filters.level}
          />

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Available Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Book List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <BookCard
              key={book._id}
              book={book}
              linkTo={`/books/${book._id}`}
              onDelete={() => {
                setBooks(prev => prev.filter(b => b._id !== book._id));
              }}
              showAdminActions={user.role === 'admin'}
            />
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No books found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default BookList;