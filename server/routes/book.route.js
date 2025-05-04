const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const auth = require('../middlewares/auth');
const { uploadMiddleware } = require('../middlewares/upload');

// Admin routes
router.post('/', 
  auth.protect, 
  auth.authorize('admin'), 
  uploadMiddleware('file'), 
  bookController.addBook
);

router.put('/:id', 
  auth.protect, 
  auth.authorize('admin'), 
  uploadMiddleware('file'), 
  bookController.updateBook
);

router.delete('/:id', 
  auth.protect, 
  auth.authorize('admin'), 
  bookController.deleteBook
);

// Public routes (with student restrictions in controller)
router.get('/', auth.protect, bookController.getBooks);
router.get('/:id', auth.protect, bookController.getBookById);

module.exports = router;