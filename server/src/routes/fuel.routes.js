const express = require('express');
const { getFuelLogs, createFuelLog, deleteFuelLog } = require('../controllers/fuel.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', authorize('Fleet Manager', 'Financial Analyst'), getFuelLogs);
router.post('/', authorize('Fleet Manager', 'Dispatcher'), createFuelLog);
router.delete('/:id', authorize('Fleet Manager'), deleteFuelLog);

module.exports = router;
