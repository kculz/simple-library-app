import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useContext';
import BookForm from '../../components/forms/BookForm';

const EditBook = () => {
  const { id } = useParams();
  const { api } = useAppContext();
  const navigate = useNavigate();
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

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/books/${id}`, formData);
      navigate('/admin/books');
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Book</h1>
      <BookForm onSubmit={handleSubmit} initialData={book} />
    </div>
  );
};

export default EditBook;