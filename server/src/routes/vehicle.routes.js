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

router.use(protect);

// Read operations - Fleet Manager, Dispatcher
router.get('/', authorize('Fleet Manager', 'Dispatcher'), getVehicles);
router.get('/:id', authorize('Fleet Manager', 'Dispatcher'), getVehicleById);

// Write operations - Fleet Manager only
router.post('/', authorize('Fleet Manager'), createVehicle);
router.put('/:id', authorize('Fleet Manager'), updateVehicle);
router.delete('/:id', authorize('Fleet Manager'), deleteVehicle);

module.exports = router;
