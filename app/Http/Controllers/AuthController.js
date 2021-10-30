const User = require("../../Models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');


const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.login = (req, res, next) => {

    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    return res.render('auth/login', {
        pageTitle: 'Login',
        activeLogin: true,
        errorMessage: errorMessage
    });
}

exports.register = (req, res, next) => {

    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/register', {
        pageTitle: 'Register',
        activeRegister: true,
        errorMessage: errorMessage
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
                req.flash('error', 'Invalid Email Address !');
                return res.redirect('/admin/login');
            }
            else {
                bcrypt.compare(password, user.password)
                    .then((passwordMatched) => {
                        if (passwordMatched) {
                            req.session.user = user;
                            req.session.isLoggedIn = true;
                            req.session.save(err => {
                                console.log(err);
                                return res.redirect('/error');
                            });
                            return res.redirect('/');
                        }
                        else {
                            req.flash('error', 'Invalid Email or Password !');
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
                req.flash('error', 'Account already exist, Pick different e-mail !');
                return res.redirect('/admin/register');
            }
            if (password !== confirmPassword) {
                req.flash('error', 'Confirm Password Doesnt Matched !');
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
                    req.session.save(err => {
                        console.log(err);
                        res.redirect('/error');
                    })
                    
                    res.redirect('/admin/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'mozmbutt8@gmail.com',
                        subject: 'Aroma - Account Created',
                        text: 'Hi ' + username + '! Thanks for sign up with our online store.',
                    })
                    .catch( err => {
                        console.log(err);
                    })
                    
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
    req.session.destroy(err => {
        console.log(err);
        return res.redirect('/');
    });
}

exports.getResetPassword = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    return res.render('auth/forget-password', {
        pageTitle: 'Reset Password',
        activeLogin: true,
        errorMessage: errorMessage
    });
}

exports.resetPassword = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            res.flash('error', err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({ 
            where: {
                email: email
            }
        })
        .then(user => {
            if(!user){
                console.log(user);
                req.flash('error', 'No account found with this e-mail');
                return res.redirect('/reset-password');
            }
            user.token = token;
            user.token_expire = Date.now() + 3600000;
            return user.save();
        })
        .then( result => {
            res.redirect('/admin/login')
            transporter.sendMail({
                to: email,
                from: 'mozmbutt8@gmail.com',
                subject: 'Aroma - Reset Password',
                text: `
                    <p>You requested to reset password</p>
                    <p>Click this <a href="http://127.0.0.1:8000/reset-password/${token}"> reset password </a> link to reset your password.</p>
                `
            })
        })
        .catch((err) => {
            
        });
    });
}

exports.resetPasswordRequest = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    return res.render('auth/new-password', {
        pageTitle: 'New Password',
        activeLogin: true,
        errorMessage: errorMessage
    });
}