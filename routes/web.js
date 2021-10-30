const express = require('express');
const router = express.Router();
const HomeController = require('../app/Http/Controllers/HomeController');
const ProductController = require('../app/Http/Controllers/ProductController');
const AuthController = require('../app/Http/Controllers/AuthController');

router.get('/' , ProductController.index)
router.get('/contact' , HomeController.contact)
router.get('/view-product/:id', ProductController.fetchById);
router.get('/reset-password', AuthController.getResetPassword);
router.post('/reset-password', AuthController.resetPassword);

router.get('/new-password/:token', AuthController.getNewPassword);
router.post('/new-password', AuthController.setNewPassword);

module.exports = router;