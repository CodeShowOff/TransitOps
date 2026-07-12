const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, updateUserStatus } = require('../controllers/user.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(authorize('Fleet Manager'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser);

router.route('/:id/status')
  .patch(updateUserStatus);

module.exports = router;
