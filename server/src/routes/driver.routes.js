const express = require('express');
const {
  getDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver
} = require('../controllers/driver.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router
  .route('/')
  .get(authorize('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'), getDrivers)
  .post(authorize('Fleet Manager', 'Safety Officer'), createDriver);

router
  .route('/:id')
  .get(authorize('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'), getDriver)
  .put(authorize('Fleet Manager', 'Safety Officer'), updateDriver)
  .delete(authorize('Fleet Manager', 'Safety Officer'), deleteDriver);

module.exports = router;
