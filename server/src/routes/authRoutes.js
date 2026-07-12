const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.post('/login', login);

// Only Fleet Manager can create users
router.post('/register', protect, authorize('Fleet Manager'), register);

module.exports = router;
