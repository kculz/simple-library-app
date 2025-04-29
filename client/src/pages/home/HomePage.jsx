import React from 'react'
import { useAppContext } from '../../hooks/useContext';

const HomePage = () => {
  const { user } = useAppContext();

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'student') return <Navigate to="/student" replace />;

  return (
    <div className="py-12 text-center">
      <h1 className="text-4xl font-bold text-primary mb-6">Welcome to Mtre Poly Library</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Access course materials and browse our collection of books. 
        Please sign in to continue.
      </p>
    </div>
  );
}

export default HomePage