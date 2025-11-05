const express = require('express');
const router = express.Router();
const { getBalance } = require('../controllers/balanceController');

router.get('/balance', getBalance);

module.exports = router;