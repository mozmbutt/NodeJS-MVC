const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../util/path');

router.get('/login', (req, res, next) => {
    res.sendFile(path.join(rootDir , 'views' , '/auth/login.html'));
});

router.get('/register', (req, res, next) => {
    res.sendFile(path.join(rootDir , 'views' , '/auth/register.html'));
});


module.exports = router;