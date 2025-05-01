import React from 'react'
import { useAppContext } from '../../hooks/useContext';
import { Link, Navigate } from 'react-router-dom';

const LandingPage = () => {
  const { user } = useAppContext();

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'student') return <Navigate to="/student" replace />;

  return (
    <div className="py-12 text-center">
      <h1 className="text-4xl font-bold text-primary mb-6">Welcome to Mtre Poly Electric Department Library</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Access course materials and browse our collection of books. 
        Please sign in to continue.
      </p>
      <div className="mt-8">
        <Link to="/auth/student/login" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
          Sign In As Student
        </Link>
        <Link to="/auth/lecturer/login" className="ml-4 bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-secondary-dark">
          Sign In As Lecturer
        </Link>
      </div>
    </div>
  );
}

export default LandingPage