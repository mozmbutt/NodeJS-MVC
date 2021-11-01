const User = require("../../Models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { Op } = require("sequelize");
const { validationResult } = require("express-validator/check");


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
        errorMessage: errorMessage,
        oldInputs: {
            email: '',
            password: ''
        },
        validationError: []
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
        errorMessage: errorMessage,
        oldInputs: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationError: []
    });
}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('auth/login', {
            pageTitle: 'Register',
            activeRegister: true,
            errorMessage: errors.array()[0].msg,
            oldInputs: {
                email: email,
                password: password
            },
            validationError: errors.array()
        });
    }

    User.findOne({
        where: {
            email: email
        }
    })
    .then(user => {
        if(!user){
            return res.status(422).render('auth/login', {
                pageTitle: 'Login',
                activeLogin: true,
                errorMessage: 'You may not have an account with this email.',
                oldInputs: {
                    email: email,
                    password: password
                },
                validationError: [{ param: 'email' }]
            });
        }
        else{
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
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        activeLogin: true,
                        errorMessage: 'Invalid Password, Try Again',
                        oldInputs: {
                            email: email,
                            password: password
                        },
                        validationError: [{param: 'password'}]

                    });
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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).render('auth/register', {
            pageTitle: 'Register',
            activeRegister: true,
            errorMessage: errors.array()[0].msg,
            oldInputs: {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationError: errors.array()
        });
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
                .catch(err => {
                    console.log(err);
                })

        })
        .catch((err) => {
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
        if (err) {
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
                if (!user) {
                    console.log(user);
                    req.flash('error', 'No account found with this e-mail');
                    return res.redirect('/reset-password');
                }
                user.token = token;
                user.token_expire = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/admin/login')
                transporter.sendMail({
                    to: email,
                    from: 'mozmbutt8@gmail.com',
                    subject: 'Aroma - Reset Password',
                    text: `
                    You requested to reset password.
                    Click this link to update password.
                    http://127.0.0.1:8000/new-password/${token}
                `
                })
            })
            .catch((err) => {

            });
    });
}

exports.getNewPassword = (req, res, next) => {

    let token = req.params.token;
    User.findOne({
        where: {
            token: token,
            token_expire: {
                [Op.gt]: Date.now()
            }
        }
    })
        .then((user) => {
            let errorMessage = req.flash('error');
            if (errorMessage.length > 0) {
                errorMessage = errorMessage[0];
            } else {
                errorMessage = null;
            }

            return res.render('auth/new-password', {
                pageTitle: 'New Password',
                activeLogin: true,
                errorMessage: errorMessage,
                userId: user.id,
                token: token,
            });
        })
        .catch((err) => {
            console.log(err);
        });

}

exports.setNewPassword = (req, res, next) => {
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let userId = req.body.user_id;
    let token = req.body.token;
    let my_user;

    if (password !== confirmPassword) {
        req.flash('error', 'Password doesnt match !');
        return res.redirect('/new-password/' + token);
    }

    User.findOne({
        where: {
            token: token,
            token_expire: {
                [Op.gt]: Date.now()
            },
            id: userId
        }
    })
        .then((user) => {
            my_user = user;
            return bcrypt.hash(password, 12);
        })
        .then(hashedPassword => {
            my_user.password = hashedPassword,
                my_user.token = undefined;
            my_user.token_expire = undefined;
            return my_user.save();
        })
        .then(result => {
            res.redirect('/admin/login');
            transporter.sendMail({
                to: my_user.email,
                from: 'mozmbutt8@gmail.com',
                subject: 'Aroma - Password changed successfully',
                text: `
                Your password has been changed successfully.
            `
            })
        })
        .catch((err) => {
            console.log(err);
        });


}