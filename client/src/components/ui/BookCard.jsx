import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, linkTo }) => {
  return (
    <div className="relative group perspective-1000 w-full h-64">
      {/* Book Container */}
      <div className="relative w-full h-full transition-all duration-500 transform-style-preserve-3d group-hover:rotate-y-20">
        {/* Book Cover (Front) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-r-lg shadow-lg border-l-8 border-blue-700 p-4 flex flex-col backface-hidden">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2 italic">{book.author}</p>
            
            {book.courseCode && (
              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                {book.courseCode}
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-auto">
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
                className="text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                View →
              </Link>
            )}
          </div>
        </div>
        
        {/* Book Spine */}
        <div className="absolute left-0 top-0 w-8 h-full bg-blue-700 rounded-l-lg shadow-lg transform-origin-right transform-rotate-y-90" />
        
        {/* Back Cover (visible on hover) */}
        <div className="absolute inset-0 bg-blue-50 rounded-lg shadow-lg transform-rotate-y-180 backface-hidden p-4">
          <div className="h-full flex flex-col justify-center items-center text-center">
            <p className="text-sm text-gray-600 mb-2">Published: {book.publicationYear || 'N/A'}</p>
            <p className="text-xs text-gray-500">ISBN: {book.isbn || 'Not specified'}</p>
            {linkTo && (
              <Link 
                to={linkTo}
                className="mt-4 text-sm text-blue-700 hover:text-blue-900 font-medium underline"
              >
                More Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;