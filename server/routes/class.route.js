const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', classController.getClasses);
router.get('/filters', classController.getBookFilters);
router.get('/level/:level', classController.getClassesByLevel);
router.get('/:id', classController.getClassById);

// Admin routes
router.post('/', auth.protect, auth.authorize('admin'), classController.createClass);
router.put('/:id', auth.protect, auth.authorize('admin'), classController.updateClass);
router.delete('/:id', auth.protect, auth.authorize('admin'), classController.deleteClass);

module.exports = router;