exports.index = (req, res, next) => {
    res.render('shop/index', {
        data: [],
        pageTitle: 'Home',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.not_found_404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404 - Page Not Found',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.cart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        activeCart: true,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.checkout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        activeCheckout: true,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.contact = (req, res, next) => {
    res.render('contact', {
        pageTitle: 'Contact Us',
        activeContact: true,
        isAuthenticated: req.session.isLoggedIn
    });
}