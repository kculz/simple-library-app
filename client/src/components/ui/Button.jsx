import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Button = ({
  children,
  type = 'button',
  variant = 'default',
  className = '',
  loading = false,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    default: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary',
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className} flex items-center justify-center`}
      disabled={loading}
      {...props}
    >
      {loading && <FaSpinner className="animate-spin mr-2" />}
      {children}
    </button>
  );
};

export default Button;