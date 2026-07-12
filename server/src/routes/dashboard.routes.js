const express = require('express');
const { getDashboard } = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);

// Fleet Manager, Financial Analyst, Safety Officer, and Dispatcher can view Dashboard
router.get('/', authorize('Fleet Manager', 'Financial Analyst', 'Safety Officer', 'Dispatcher'), getDashboard);

module.exports = router;
