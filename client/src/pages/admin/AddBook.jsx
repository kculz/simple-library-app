import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';

const AddBook = () => {
  const { api } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await api.post('/books', formData);
      navigate('/admin/books');
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
      <BookForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddBook;