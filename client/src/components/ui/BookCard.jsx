// components/ui/BookCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaUser, FaCalendarAlt, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';

const BookCard = ({ book, linkTo, showAdminActions = false, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2 flex items-center">
          <FaUser className="mr-1" /> {book.author}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {book.class}
          </span>
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            {book.level}
          </span>
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {book.module}
          </span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className={`text-xs px-2 py-1 rounded ${
            book.available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {book.available ? 'Available' : 'Checked Out'}
          </span>
          
          <div className="flex space-x-2">
            {book.fileUrl && (
              <a 
                href={book.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
                title="Download"
              >
                <FaDownload />
              </a>
            )}
            {showAdminActions && (
              <>
                <Link
                  to={`/admin/books/edit/${book._id}`}
                  className="text-yellow-600 hover:text-yellow-800 text-sm"
                  title="Edit"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={() => onDelete(book._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;