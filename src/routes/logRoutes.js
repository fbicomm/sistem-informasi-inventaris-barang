const express = require('express');

const router = express.Router();
const { getLog, clearLogs } = require('../controllers/logController');

router.get('/log', getLog);
router.post('/log/clear', clearLogs);

module.exports = router;
