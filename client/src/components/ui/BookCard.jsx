import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, linkTo }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        
        {book.courseCode && (
          <span className="inline-block bg-primary-light text-primary text-xs px-2 py-1 rounded mb-3">
            {book.courseCode}
          </span>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <span className={`text-xs px-2 py-1 rounded ${
            book.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {book.available ? 'Available' : 'Checked Out'}
          </span>
          
          {linkTo && (
            <Link 
              to={linkTo}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;