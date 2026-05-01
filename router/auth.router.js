var express = require('express');
var router = express.Router();

var { signUp, signIn, signOut } = require('../controllers/auth.controller');

// POST /api/v1/auth/sign-up
router.post('/sign-up', signUp);

// POST /api/v1/auth/sign-in
router.post('/sign-in', signIn);

// POST /api/v1/auth/sign-out
router.post('/sign-out', signOut);

module.exports = router;
