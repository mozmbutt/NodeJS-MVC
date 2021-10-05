exports.index = (req, res, next) => {
    res.render('shop/index', {
        data: [],
        pageTitle: 'Home'
    });
}

exports.not_found_404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404 - Page Not Found'
    });
}

exports.cart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        activeCart: true
    });
}

exports.checkout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        activeCheckout: true
    });
}

exports.contact = (req, res, next) => {
    res.render('contact', {
        pageTitle: 'Contact Us',
        activeContact: true
    });
}


exports.login = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        activeLogin: true
    });
}


exports.register = (req, res, next) => {
    res.render('auth/register', {
        pageTitle: 'Register',
        activeRegister: true
    });
}