const express = require('express');
const { getAnalytics, getChartData } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);

// Fleet Manager and Financial Analyst can access analytics
router.get('/', authorize('Fleet Manager', 'Financial Analyst'), getAnalytics);
router.get('/charts', authorize('Fleet Manager', 'Financial Analyst'), getChartData);

module.exports = router;
