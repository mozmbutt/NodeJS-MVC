const ProductsController = require('./ProductsController');
const products = ProductsController.products;

exports.index = (req, res, next) => {
    console.log(products);
    console.log(products.length);
    res.render('index', {
        data: products,
        pageTitle: 'Aroma Shop - Home',
        activeHome: true
    })
}