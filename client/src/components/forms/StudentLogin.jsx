import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';
import { FaUserGraduate, FaLock } from 'react-icons/fa';
import Input from './Input';
import Button from '../ui/Button';

const StudentLogin = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // In a real app, you would call your API here
      // For demo purposes, we'll simulate a login
      const user = {
        id: 'student123',
        studentId: formData.studentId,
        name: 'Demo Student',
        role: 'student',
        department: 'computer-science',
      };
      
      login(user, 'student-auth-token');
      navigate('/student/');
    } catch (error) {
      setErrors({ form: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Student Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the library
          </p>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="Student ID"
              name="studentId"
              type="text"
              Icon={FaUserGraduate}
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
              placeholder="e.g. MTRE/2023/001"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              Icon={FaLock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Not a student?{' '}
            <a
              href="/auth/lecturer/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Lecturer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;