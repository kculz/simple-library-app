import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useContext';
import Input from './Input';
import Select from './Select';
import Button from '../ui/Button';
import { 
  FaBook, 
  FaUserEdit, 
  FaUniversity, 
  FaCalendarAlt, 
  FaInfoCircle,
  FaFileUpload,
  FaGraduationCap
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const BookForm = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    isbn: initialData.isbn || '',
    department: initialData.department || user.department || 'computer-science',
    courseCode: initialData.courseCode || '',
    publicationYear: initialData.publicationYear || new Date().getFullYear(),
    publisher: initialData.publisher || '',
    edition: initialData.edition || '1st',
    description: initialData.description || '',
    bookType: initialData.courseCode ? 'course' : 'general',
    available: initialData.available !== undefined ? initialData.available : true,
    level: initialData.level || 'NC', // Added qualification level field
    file: null // Added file upload field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData.fileUrl || '');

  const departments = [
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' }
  ];

  const bookTypes = [
    { value: 'course', label: 'Course Book' },
    { value: 'general', label: 'General Book' }
  ];

  const levels = [
    { value: 'NC', label: 'NC (National Certificate)' },
    { value: 'ND', label: 'ND (National Diploma)' },
    { value: 'HND', label: 'HND (Higher National Diploma)' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (formData.bookType === 'course' && !formData.courseCode) {
      newErrors.courseCode = 'Course code is required for course books';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form data to FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
      
      await onSubmit(formDataToSend);
      toast.success(`Book ${isEdit ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      toast.error(error.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
            placeholder="Enter book title"
            required
          />

          <Input
            label="Author"
            name="author"
            Icon={FaUserEdit}
            value={formData.author}
            onChange={handleChange}
            error={errors.author}
            placeholder="Enter author name"
            required
          />

          <Input
            label="ISBN"
            name="isbn"
            Icon={FaBook}
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN (optional)"
          />

          <Input
            label="Publisher"
            name="publisher"
            Icon={FaUniversity}
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Enter publisher name"
          />

          <Select
            label="Department"
            name="department"
            Icon={FaUniversity}
            value={formData.department}
            onChange={(value) => handleSelectChange('department', value)}
            options={departments}
            error={errors.department}
            required
          />

          <Select
            label="Book Type"
            name="bookType"
            value={formData.bookType}
            onChange={(value) => handleSelectChange('bookType', value)}
            options={bookTypes}
          />

          {formData.bookType === 'course' && (
            <Input
              label="Course Code"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              error={errors.courseCode}
              placeholder="e.g. CSC101"
              required
            />
          )}

          <Select
            label="Qualification Level"
            name="level"
            Icon={FaGraduationCap}
            value={formData.level}
            onChange={(value) => handleSelectChange('level', value)}
            options={levels}
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
            label="Edition"
            name="edition"
            value={formData.edition}
            onChange={handleChange}
            placeholder="e.g. 3rd, Revised, etc."
          />

          <div className="md:col-span-2">
            <Input
              label="Description"
              name="description"
              type="textarea"
              Icon={FaInfoCircle}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the book"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Cover/File
            </label>
            <div className="mt-1 flex items-center">
              <label className="cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                <span className="flex items-center">
                  <FaFileUpload className="mr-2" />
                  {formData.file ? formData.file.name : 'Choose a file...'}
                </span>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  accept="image/*,.pdf,.doc,.docx"
                />
              </label>
            </div>
            {previewUrl && formData.file?.type.startsWith('image/') && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="h-32 object-contain border rounded"
                />
              </div>
            )}
            {formData.file?.type === 'application/pdf' && (
              <div className="mt-2 text-sm text-gray-500">
                PDF file selected
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="available"
              name="available"
              type="checkbox"
              checked={formData.available}
              onChange={(e) => handleSelectChange('available', e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
              Available for borrowing
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.history.back()}
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