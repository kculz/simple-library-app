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
      
      <div className="flex gap-4 mb-6">
        <Select
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          options={[
            { value: 'computer-science', label: 'Computer Science' },
            { value: 'electrical', label: 'Electrical Engineering' },
            { value: 'mechanical', label: 'Mechanical Engineering' },
          ]}
        />
        
        <Select
          label="Course"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          options={[
            { value: '', label: 'All Books' },
            { value: 'CSC101', label: 'CSC101 - Intro to Computing' },
            { value: 'CSC102', label: 'CSC102 - Programming' },
          ]}
        />
      </div>

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