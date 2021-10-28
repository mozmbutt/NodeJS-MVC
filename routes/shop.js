const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const path = require('path');
const ProductController = require('../app/Http/Controllers/ProductController');
const isAuth = require('../app/Http/Middleware/is-auth');

router.get('/add-product', isAuth, ProductController.create);
router.post('/product', isAuth, ProductController.store);

router.get('/products', isAuth, ProductController.show);
router.get('/orders',  isAuth, ProductController.getAllOrders)

router.get('/delete-product/:id', isAuth, ProductController.delete);
router.get('/view-product/:id', isAuth, ProductController.fetchById);
router.get('/edit-product/:id', isAuth, ProductController.edit);
router.post('/update-product/:id', isAuth, ProductController.update);

module.exports = router;