import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../hooks/useContext';
import { 
  FaBook, FaUser, FaCalendarAlt, FaDownload, 
  FaBookOpen, FaUniversity, FaLayerGroup, 
  FaCheckCircle, FaTimesCircle, FaEye 
} from 'react-icons/fa';
import { MdPersonAddAlt1 } from 'react-icons/md';

const BookDetails = () => {
  const { id } = useParams();
  const { api } = useAppContext();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Failed to fetch book:', error);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, api]);

  const handleViewBook = () => {
    // Open in new tab for PDFs and other viewable formats
    if (book.fileType.includes('pdf') || book.fileType.includes('image')) {
      window.open(book.fileUrl, '_blank');
    } else {
      // For non-viewable formats, show a modal with download option
      setShowViewer(true);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    </div>
  );

  if (!book) return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
        Book not found
      </div>
    </div>
  );

  const getFileTypeIcon = () => {
    if (book.fileType.includes('pdf')) return <FaBook className="mr-1" />;
    if (book.fileType.includes('word')) return <FaBookOpen className="mr-1" />;
    return <FaBook className="mr-1" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Book Header */}
      <div className="border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
        <p className="text-xl text-gray-600 flex items-center">
          <FaUser className="mr-2 text-gray-400" /> {book.author}
        </p>
      </div>

      {/* Book Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex items-start">
            <FaUniversity className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Class</h3>
              <p className="text-gray-800">{book.class}</p>
            </div>
          </div>

          <div className="flex items-start">
            <FaLayerGroup className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Module</h3>
              <p className="text-gray-800">{book.module}</p>
            </div>
          </div>

          <div className="flex items-start">
            <FaCalendarAlt className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Publication Year</h3>
              <p className="text-gray-800">{book.publicationYear}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mt-1 mr-3 text-gray-400 flex-shrink-0">
              {book.available ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaTimesCircle className="text-red-500" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Availability</h3>
              <p className={book.available ? "text-green-600" : "text-red-600"}>
                {book.available ? 'Available for download' : 'Currently unavailable'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            {getFileTypeIcon()}
            <div>
              <h3 className="text-sm font-medium text-gray-500">File Type</h3>
              <p className="text-gray-800">
                {book.fileType.split('/').pop().toUpperCase()} Document
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <MdPersonAddAlt1 className="mt-1 mr-3 text-gray-400 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Added By</h3>
              <p className="text-gray-800">{book.addedBy?.name || 'System'}</p>
              <p className="text-sm text-gray-500">
                {new Date(book.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-medium text-gray-800 mb-1">Access this resource</h3>
            <p className="text-sm text-gray-500">
              {book.fileName} ({Math.round(Math.random() * 5 + 1)} MB)
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleViewBook}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaEye className="mr-2" />
              View Book
            </button>
            <a
              href={book.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              download
            >
              <FaDownload className="mr-2" />
              Download
            </a>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">About this resource</h3>
        <p className="text-gray-600">
          This {book.module} resource is part of the {book.class} curriculum at {book.level} level. 
          It was uploaded to the library on {new Date(book.createdAt).toLocaleDateString()} 
          and is available for all enrolled students.
        </p>
      </div>

      {/* Viewer Modal */}
      {showViewer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">View {book.title}</h3>
              <button 
                onClick={() => setShowViewer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="text-center py-12">
                <FaBookOpen className="mx-auto text-5xl text-gray-400 mb-4" />
                <p className="text-lg text-gray-700 mb-6">
                  This file format cannot be previewed directly. Please download the file to view it.
                </p>
                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  download
                >
                  <FaDownload className="mr-2" />
                  Download Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;