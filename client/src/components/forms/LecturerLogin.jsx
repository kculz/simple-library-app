import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';
import { FaUserTie, FaLock, FaUniversity } from 'react-icons/fa';
import Input from './Input';
import Button from '../ui/Button';

const LecturerLogin = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    classes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.classes) newErrors.classes = 'class is required';
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
        id: 'lecturer123',
        email: formData.email,
        name: 'Dr. Lecturer',
        role: 'admin',
        classes: formData.classes,
        courses: ['CSC101', 'CSC201'],
      };
      
      login(user, 'lecturer-auth-token');
      navigate('/admin/');
    } catch (error) {
      setErrors({ form: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary-light flex items-center justify-center">
            <FaUserTie className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            Lecturer Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage course materials
          </p>
        </div>

        {errors.form && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {errors.form}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            name="email"
            type="email"
            Icon={FaUserTie}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="lecturer@mtrepoly.edu"
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

          <div>
            <label htmlFor="classes" className="block text-sm font-medium text-gray-700">
              Class
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUniversity className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="classes"
                name="classes"
                value={formData.classes}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="sc">Computer Systems</option>
                <option value="electrical">Electrical Power</option>
                <option value="ics">Instrumentation & Control Systems</option>
                <option value="comsys">Communication Systems</option>
              </select>
            </div>
            {errors.class && (
              <p className="mt-1 text-sm text-red-600">{errors.class}</p>
            )}
          </div>

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
              Remember this device
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              loading={loading}
            >
              Sign in as Lecturer
            </Button>
          </div>
        </form>

        <div className="text-center text-sm pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Student?{' '}
            <a
              href="/auth/student/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Student login portal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LecturerLogin;