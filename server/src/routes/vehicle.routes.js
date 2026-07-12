const express = require('express');
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicle.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Read operations - all authenticated users
router.get('/', protect, getVehicles);
router.get('/:id', protect, getVehicleById);

// Write operations - Fleet Manager only
router.post('/', protect, authorize('Fleet Manager'), createVehicle);
router.put('/:id', protect, authorize('Fleet Manager'), updateVehicle);
router.delete('/:id', protect, authorize('Fleet Manager'), deleteVehicle);

module.exports = router;
