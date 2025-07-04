// components/forms/BookForm.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useContext';
import Input from './Input';
import Select from './Select';
import Button from '../ui/Button';
import { 
  FaBook, FaUserEdit, FaUniversity, FaCalendarAlt, 
  FaInfoCircle, FaFileUpload, FaGraduationCap, FaLayerGroup 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookForm = ({ initialData = {}, isEdit = false }) => {
  const { user, api } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    class: initialData.class || '',
    module: initialData.module || '',
    level: initialData.level || '',
    publicationYear: initialData.publicationYear || new Date().getFullYear(),
    publisher: initialData.publisher || '',
    description: initialData.description || '',
    available: initialData.available !== undefined ? initialData.available : true,
    file: null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState([]);

  const classes = [
    'Computer Systems',
    'Electrical Power',
    'Instrumentation & Control',
    'Communication Systems'
  ];

  const levels = ['NC', 'ND', 'HND'];

  // Fetch modules when class or level changes
  useEffect(() => {
    const fetchModules = async () => {
      try {
        if (formData.class && formData.level) {
          const response = await api.get(`/classes/filters?class=${formData.class}&level=${formData.level}`);
          setModules(response.data.modules || []);
          
          // Reset module if it's no longer valid for the new class/level
          if (formData.module && !response.data.modules?.some(m => m.name === formData.module)) {
            setFormData(prev => ({ ...prev, module: '' }));
          }
        } else {
          setModules([]);
          setFormData(prev => ({ ...prev, module: '' }));
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setModules([]);
      }
    };
    
    fetchModules();
  }, [formData.class, formData.level, api]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.module) newErrors.module = 'Module is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form data except file first
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'file' && value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      // Append file if exists
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      let response;
      if (isEdit) {
        response = await api.put(`/books/${initialData._id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.post('/books', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      toast.success(`Book ${isEdit ? 'updated' : 'added'} successfully!`);
      navigate(isEdit ? `/books/${response.data._id}` : '/admin/books');
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error(error.response?.data?.error || `Failed to ${isEdit ? 'update' : 'add'} book`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-primary mb-6">
          {isEdit ? 'Edit Book' : 'Add New Book'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title"
            name="title"
            Icon={FaBook}
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
          />

          <Input
            label="Author"
            name="author"
            Icon={FaUserEdit}
            value={formData.author}
            onChange={handleChange}
            error={errors.author}
            required
          />

          <Select
            label="Class"
            name="class"
            Icon={FaUniversity}
            value={formData.class}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select a class' },
              ...classes.map(c => ({ value: c, label: c }))
            ]}
            error={errors.class}
            required
          />

          <Select
            label="Level"
            name="level"
            Icon={FaGraduationCap}
            value={formData.level}
            onChange={handleChange}
            options={[
              { value: '', label: 'Select a level' },
              ...levels.map(l => ({ value: l, label: l }))
            ]}
            error={errors.level}
            required
          />

          <Select
            label="Module"
            name="module"
            Icon={FaLayerGroup}
            value={formData.module}
            onChange={handleChange}
            options={[
              { value: '', label: modules.length > 0 ? 'Select a module' : 'Select class and level first' },
              ...modules.map(m => ({ value: m.name, label: m.name }))
            ]}
            error={errors.module}
            required
            disabled={!formData.class || !formData.level || modules.length === 0}
          />

          <Input
            label="Publication Year"
            name="publicationYear"
            type="number"
            Icon={FaCalendarAlt}
            value={formData.publicationYear}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
          />

          <Input
            label="Publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Input
              label="Description"
              name="description"
              type="textarea"
              Icon={FaInfoCircle}
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book File (PDF/DOCX)
            </label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none border border-gray-300 px-4 py-2">
                <span className="flex items-center">
                  <FaFileUpload className="mr-2" />
                  {formData.file?.name || 'Choose a file...'}
                </span>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
            {initialData.fileUrl && !formData.file && (
              <p className="mt-2 text-sm text-gray-500">
                Current file: {initialData.fileName}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
              Available for students
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            {isEdit ? 'Update Book' : 'Add Book'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BookForm;