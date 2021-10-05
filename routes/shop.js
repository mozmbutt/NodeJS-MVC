const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');
const path = require('path');
const ProductController = require('../app/Http/Controllers/ProductController');

router.post('/product', ProductController.store);
router.get('/add-product', ProductController.create);
router.get('/products', ProductController.show);
router.get('/delete-product/:id', ProductController.delete);
router.get('/view-product/:id', ProductController.fetchById);
router.get('/edit-product/:id', ProductController.edit);
router.post('/update-product/:id', ProductController.update);

module.exports = router;