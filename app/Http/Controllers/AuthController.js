const User = require("../../Models/User");
const bcrypt = require('bcryptjs')

exports.login = (req, res, next) => {

    res.render('auth/login', {
        pageTitle: 'Login',
        activeLogin: true,
    });
}

exports.register = (req, res, next) => {
    res.render('auth/register', {
        pageTitle: 'Register',
        activeRegister: true,
    });
}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    })
    .then(user => {
        if (!user) {
            return res.redirect('/admin/register');
        }
        else {
            bcrypt.compare(password, user.password)
            .then((passwordMatched) => {
                if(passwordMatched){
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    req.session.save( err => {
                        console.log(err);
                        return res.redirect('/error');
                    });
                    return res.redirect('/');
                }
                else{
                    return res.redirect('/admin/login');
                }
            })
            .catch((err) => {
                console.log(err);
                return res.redirect('/admin/login');
            });
        }
    })
    .catch(err => {
        console.log(err);
    });
}

exports.registerUser = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({
        where: { email: email }
    })
    .then(user => {
        if (user) {
            return res.redirect('/admin/register');
        }
        if (password !== confirmPassword) {
            return res.redirect('/admin/register');
        }
        return bcrypt.hash(password, 12)
            .then((hashedPassword) => {
                return User.create({
                    username: username,
                    email: email,
                    password: hashedPassword
                })
            })
            .then(user => {
                user.createCart();
                req.session.isLoggedIn = false;
                req.session.user = null;
                req.session.save( err => {
                    console.log(err);
                    res.redirect('/error');
                })
                return res.redirect('/admin/login');
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.logout = (req, res, next) => {
    req.session.destroy( err => {
        console.log(err);
        return res.redirect('/');
    });
}