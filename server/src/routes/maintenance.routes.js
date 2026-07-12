const express = require('express');
const router = express.Router();
const {
  getMaintenances,
  getMaintenanceById,
  createMaintenance,
  completeMaintenance,
  deleteMaintenance
} = require('../controllers/maintenance.controller');

// Assuming there's some protect middleware for auth, let's keep it consistent
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Apply protect middleware to all routes if auth is needed
router.use(protect);

router.route('/')
  .get(authorize('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'), getMaintenances)
  .post(authorize('Fleet Manager'), createMaintenance); // Adjust roles as needed based on RBAC

router.route('/:id')
  .get(authorize('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'), getMaintenanceById)
  .delete(authorize('Fleet Manager'), deleteMaintenance);

router.route('/:id/complete')
  .patch(authorize('Fleet Manager'), completeMaintenance);

module.exports = router;
