const express = require('express');
const router = express.Router();
const HomeController = require('../app/Http/Controllers/HomeController');
const ProductController = require('../app/Http/Controllers/ProductController');

router.get('/' , ProductController.index)
router.get('/cart' , ProductController.cart)
router.post('/add-to-cart' , ProductController.addToCart)
router.post('/remove-from-cart' , ProductController.deleteFromCart)
router.post('/proceedToCheckout' , ProductController.proceedToCheckout)



router.get('/checkout' , HomeController.checkout)
router.get('/contact' , HomeController.contact)

module.exports = router;