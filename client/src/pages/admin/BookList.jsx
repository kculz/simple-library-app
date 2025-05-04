import { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useContext';
import BookCard from '../../components/ui/BookCard';
import Select from '../../components/forms/Select';

const BookList = () => {
  const { api } = useAppContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    class: '',
    level: '',
    module: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    classes: [],
    levels: [],
    modules: []
  });

  // Fetch initial filter options and books
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch filter options
        const filtersResponse = await api.get('/classes/filters');
        setFilterOptions(filtersResponse.data);

        // Fetch initial books
        const booksResponse = await api.get('/books');
        setBooks(booksResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
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

        const response = await api.get('/books/', { params });
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
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

  // Get filtered levels based on selected class
  const getFilteredLevels = () => {
    if (!filters.class) return filterOptions.levels;
    return filterOptions.levels.filter(l => 
      l.classes.includes(filters.class)
    );
  };

  // Get filtered modules based on selected class and level
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
      <h1 className="text-3xl font-bold mb-8">Browse Library Resources</h1>
      
      {/* Filter Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Class"
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            options={[
              { value: '', label: 'All Classes' },
              ...filterOptions.classes
            ]}
          />

          <Select
            label="Level"
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            options={[
              { value: '', label: 'All Levels' },
              ...getFilteredLevels()
            ]}
            disabled={!filters.class}
          />

          <Select
            label="Module"
            value={filters.module}
            onChange={(e) => handleFilterChange('module', e.target.value)}
            options={[
              { value: '', label: 'All Modules' },
              ...getFilteredModules()
            ]}
            disabled={!filters.class || !filters.level}
          />
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">
                No books found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard 
                  key={book._id} 
                  book={book}
                  linkTo={`/books/${book._id}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;