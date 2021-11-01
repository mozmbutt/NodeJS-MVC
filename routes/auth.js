const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const AuthController = require('../app/Http/Controllers/AuthController');
const User = require("../app/Models/User");
const bcrypt = require('bcryptjs');

router.get('/login' , AuthController.login)
router.post('/login',
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email !')
    .normalizeEmail(),
    body('password')
    .isLength({min: 4})
    .isAlphanumeric()
    .withMessage('Please enter a valid password')
    .trim(), 

 AuthController.loginUser)

router.get('/register' , AuthController.register)
router.post('/register' , 
        [
            check('email')
            .isEmail()
            .withMessage('Please enter a valid email !')
            .custom((value, {req}) => {
                return User.findOne({
                    where: { email: value }
                })
                .then(user => {
                    if (user) {
                        return Promise.reject(
                            'Email already exist, Chose a diffrent one !'
                        )
                    }
                })
            })
            .normalizeEmail(), 

            body( 
                'password', 
                'Password length should be more than 8 and no special chracters allowed.'
                )
                .isLength({min: 5})
                .isAlphanumeric()
                .trim(),

            body('confirmPassword')
                .trim()
                .custom((value , { req }) => {
                    if( value !== req.body.password ){
                        throw new Error('Confirm Password Doesnt Matched !');
                    }
                })
        ],
        AuthController.registerUser);
router.post('/logout' , AuthController.logout)


module.exports = router;