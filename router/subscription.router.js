var express = require('express');
var router = express.Router();

var {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getUserSubscriptions,
} = require('../controllers/subscription.controller');
var { authorize } = require('../middlewares/auth.middleware');

// GET /api/v1/subscriptions - get all subscriptions
router.get('/', authorize, getSubscriptions);

// GET /api/v1/subscriptions/user/:id - get all subscriptions for a user
router.get('/user/:id', authorize, getUserSubscriptions);

// GET /api/v1/subscriptions/:id - get subscription by id
router.get('/:id', authorize, getSubscription);

// POST /api/v1/subscriptions - create a new subscription
router.post('/', authorize, createSubscription);

// PUT /api/v1/subscriptions/:id - update subscription by id
router.put('/:id', authorize, updateSubscription);

// DELETE /api/v1/subscriptions/:id - delete subscription by id
router.delete('/:id', authorize, deleteSubscription);

module.exports = router;
