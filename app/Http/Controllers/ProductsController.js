const products = [];

exports.store = (req, res, next) => {
    products.push({
        title: req.body.product_title,
        stock: req.body.product_stock,
        sku: req.body.product_sku,
        picture: req.body.product_picture
    });
    res.redirect('/');
}



exports.create = (req, res, next) => {
    res.render('shop/add-product', {
        pageTitle: 'Add Product'
    });
}

exports.products = products;