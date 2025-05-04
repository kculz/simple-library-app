import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useContext';
import { FaUserGraduate, FaLock } from 'react-icons/fa';
import Input from './Input';
import Button from '../ui/Button';

const StudentLogin = () => {
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
      newErrors.email = 'Please enter a valid email';
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

      // Transform the response data to match our expected structure
      const userData = {
        id: response.data._id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
        classLevels: response.data.classLevels,
        token: response.data.token
      };

      login(userData, response.data.token);
      
      // Redirect to student dashboard
      navigate('/student');

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
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-primary">
            Student Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Use your institutional email to login
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
              label="Institutional Email"
              name="email"
              type="email"
              Icon={FaUserGraduate}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="e.g. john.doe@mtrepoly.edu"
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

            <div className="text-sm">
              <a
                href="/auth/forgot-password"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
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