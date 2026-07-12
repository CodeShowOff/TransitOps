const express = require('express');
const { getFuelLogs, createFuelLog, deleteFuelLog } = require('../controllers/fuel.controller');

const router = express.Router();

router.get('/', getFuelLogs);
router.post('/', createFuelLog);
router.delete('/:id', deleteFuelLog);

module.exports = router;
