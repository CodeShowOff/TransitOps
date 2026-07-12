const express = require('express');
const { getExpenses, createExpense, deleteExpense, getExpenseSummary } = require('../controllers/expense.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/summary', authorize('Fleet Manager', 'Financial Analyst'), getExpenseSummary);
router.get('/', authorize('Fleet Manager', 'Financial Analyst'), getExpenses);
router.post('/', authorize('Fleet Manager'), createExpense);
router.delete('/:id', authorize('Fleet Manager'), deleteExpense);

module.exports = router;
