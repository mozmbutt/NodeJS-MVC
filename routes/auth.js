const express = require('express');
const router = express.Router();
const HomeController = require('../app/Http/Controllers/HomeController');

router.get('/login' , HomeController.login)
router.get('/register' , HomeController.register)

module.exports = router;