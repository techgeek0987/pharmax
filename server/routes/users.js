const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users (protected)
router.get('/', auth, userController.getAllUsers);

// Get user profile (protected)
router.get('/profile', auth, userController.getUserProfile);

// Update user profile (protected)
router.put('/profile', auth, userController.updateUserProfile);

// Delete user (protected)
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;