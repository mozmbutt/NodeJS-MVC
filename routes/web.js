const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');
const shopRoutes = require('./shop');
const HomeController = require('../app/Http/Controllers/HomeController');

router.get('/', HomeController.index);

module.exports = router;