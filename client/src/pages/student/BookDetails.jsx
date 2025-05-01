import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useContext';

const BookDetails = () => {
  const { id } = useParams();
  const { api } = useAppContext();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <BookDetailCard book={book} />
    </div>
  );
};

export default BookDetails;