const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);

// GET /api/trips
router.get('/', authorize('Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'), tripController.getTrips);

// POST /api/trips
router.post('/', authorize('Dispatcher'), tripController.createTrip);

// PATCH /api/trips/:id/dispatch
router.patch('/:id/dispatch', authorize('Dispatcher'), tripController.dispatchTrip);

// PATCH /api/trips/:id/complete
router.patch('/:id/complete', authorize('Dispatcher'), tripController.completeTrip);

// PATCH /api/trips/:id/cancel
router.patch('/:id/cancel', authorize('Dispatcher'), tripController.cancelTrip);

// DELETE /api/trips/:id
router.delete('/:id', authorize('Dispatcher'), tripController.deleteDraft);

module.exports = router;
