const express = require('express');
const { getCurrentUser, changeDisplayName, changePassword } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authenticateToken, getCurrentUser);
router.post('/change_display_name', authenticateToken, changeDisplayName);
router.post('/change_password', authenticateToken, changePassword);

module.exports = router;
