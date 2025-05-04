import { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useContext';
import BookCard from '../../components/ui/BookCard';
import Select from '../../components/forms/Select';

const BrowseBooks = () => {
  const { api } = useAppContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('computer-science');
  const [courseCode, setCourseCode] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = { department };
      if (courseCode) params.courseCode = courseCode;
      
      const response = await api.get('/books', { params });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [department, courseCode]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Browse Books</h1>
      
      

      {loading ? (
        <div>Loading books...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;