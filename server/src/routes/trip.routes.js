const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// GET /api/trips
router.get('/', authorize('Fleet Manager', 'Dispatcher', 'Safety Officer'), tripController.getTrips);

// POST /api/trips
router.post('/', authorize('Fleet Manager', 'Dispatcher'), tripController.createTrip);

// PATCH /api/trips/:id/dispatch
router.patch('/:id/dispatch', authorize('Fleet Manager', 'Dispatcher'), tripController.dispatchTrip);

// PATCH /api/trips/:id/complete
router.patch('/:id/complete', authorize('Fleet Manager', 'Dispatcher'), tripController.completeTrip);

// PATCH /api/trips/:id/cancel
router.patch('/:id/cancel', authorize('Fleet Manager', 'Dispatcher'), tripController.cancelTrip);

// DELETE /api/trips/:id
router.delete('/:id', authorize('Fleet Manager', 'Dispatcher'), tripController.deleteDraft);

module.exports = router;
