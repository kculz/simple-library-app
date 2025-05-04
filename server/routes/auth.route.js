const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', auth.protect, authController.getProfile);

// Admin-only routes
router.post('/bulk-create-students', auth.protect, auth.authorize('admin'), authController.bulkCreateStudents);

module.exports = router;