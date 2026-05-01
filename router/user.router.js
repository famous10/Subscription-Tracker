var express = require('express');
var router = express.Router();

var { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
var { authorize } = require('../middlewares/auth.middleware');

// GET /api/v1/users - get all users
router.get('/', authorize, getUsers);

// GET /api/v1/users/:id - get user by id
router.get('/:id', authorize, getUser);

// POST /api/v1/users - create a new user
router.post('/', authorize, createUser);

// PUT /api/v1/users/:id - update user by id
router.put('/:id', authorize, updateUser);

// DELETE /api/v1/users/:id - delete user by id
router.delete('/:id', authorize, deleteUser);

module.exports = router;
