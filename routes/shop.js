const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const path = require('path');
const ProductController = require('../app/Http/Controllers/ProductsController');

router.post('/product', ProductController.store);
router.get('/add-product', ProductController.create);

module.exports.router = router;