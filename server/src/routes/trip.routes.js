const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');

// GET /api/trips
router.get('/', tripController.getTrips);

// POST /api/trips
router.post('/', tripController.createTrip);

// PATCH /api/trips/:id/dispatch
router.patch('/:id/dispatch', tripController.dispatchTrip);

// PATCH /api/trips/:id/complete
router.patch('/:id/complete', tripController.completeTrip);

// PATCH /api/trips/:id/cancel
router.patch('/:id/cancel', tripController.cancelTrip);

// DELETE /api/trips/:id
router.delete('/:id', tripController.deleteDraft);

module.exports = router;
