import { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useContext';
import { Button } from '../../components';
import BookTable from './BookTable';

const BooksPage = () => {
  const { api } = useAppContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`);
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <Button to="/admin/books/add" variant="primary">
          Add New Book
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <BookTable 
        books={books} 
        loading={loading} 
        onDelete={handleDelete} 
      />
    </div>
  );
};

export default BooksPage;