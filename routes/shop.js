const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const path = require('path');
const ProductController = require('../app/Http/Controllers/ProductController');
const HomeController = require('../app/Http/Controllers/HomeController');
const isAuth = require('../app/Http/Middleware/is-auth');

router.get('/add-product', isAuth, ProductController.create);
router.post('/product', isAuth, ProductController.store);

router.get('/products', isAuth, ProductController.show);
router.get('/orders',  isAuth, ProductController.getAllOrders)

router.get('/delete-product/:id', isAuth, ProductController.delete);
router.get('/edit-product/:id', isAuth, ProductController.edit);
router.post('/update-product/:id', isAuth, ProductController.update);

router.get('/cart' , isAuth, ProductController.cart)
router.post('/add-to-cart' , isAuth, ProductController.addToCart)
router.post('/remove-from-cart' , isAuth, ProductController.deleteFromCart)
router.post('/proceedToCheckout' , isAuth, ProductController.proceedToCheckout)
router.get('/checkout' , isAuth, HomeController.checkout)

module.exports = router;