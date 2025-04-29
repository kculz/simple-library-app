import { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useContext';
import BookList from './BookList';
import { AddBookForm } from '../../components';

const AdminDashboard = () => {
  const { api } = useAppContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (bookData) => {
    try {
      await api.post('/books', bookData);
      fetchBooks();
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AddBookForm onSubmit={handleAddBook} />
      <BookList books={books} loading={loading} isAdmin />
    </div>
  );
};

export default AdminDashboard;