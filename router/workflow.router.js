var express = require('express');
var router = express.Router();

var { sendReminders } = require('../controllers/workflow.controller');

// POST /api/v1/workflows/subscription/reminder - trigger subscription reminder workflow
router.post('/subscription/reminder', (req, res) => sendReminders.handler(req, res));

module.exports = router;
