import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';
import { FaUserTie, FaLock } from 'react-icons/fa';
import Input from './Input';
import Button from '../ui/Button';

const LecturerLogin = () => {
  const { login, api } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid institutional email';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Assuming backend returns:
      // {
      //   token: "jwt-token",
      //   user: {
      //     _id: "lecturer123",
      //     email: "lecturer@mtrepoly.edu",
      //     name: "Dr. Lecturer",
      //     role: "lecturer",
      //     courses: ["CSC101", "CSC201"]
      //   }
      // }
      
      login(response.data.user, response.data.token);
      
      // Redirect based on role
      navigate('/admin');
      

    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setErrors({ form: errorMessage });
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
            label="Institutional Email"
            name="email"
            type="email"
            Icon={FaUserTie}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="lecturer@mtrepoly.edu"
            autoComplete="username"
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
            autoComplete="current-password"
          />

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
              disabled={loading}
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