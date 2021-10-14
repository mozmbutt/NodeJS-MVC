const express = require('express');
const router = express.Router();
const HomeController = require('../app/Http/Controllers/HomeController');
const ProductController = require('../app/Http/Controllers/ProductController');

router.get('/' , ProductController.index)
router.get('/cart' , ProductController.cart)
router.get('/add-to-cart/:id' , ProductController.addToCart)
router.get('/checkout' , HomeController.checkout)
router.get('/contact' , HomeController.contact)

module.exports = router;