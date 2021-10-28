const express = require('express');
const router = express.Router();
const HomeController = require('../app/Http/Controllers/HomeController');
const ProductController = require('../app/Http/Controllers/ProductController');

router.get('/' , ProductController.index)
router.get('/contact' , HomeController.contact)
router.get('/view-product/:id', ProductController.fetchById);

module.exports = router;