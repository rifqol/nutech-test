const express = require('express');
const router = express.Router();
const { getBanners } = require('../controllers/bannerController');

router.get('/banner', getBanners);

module.exports = router;