const Product = require('../../Models/Product');
const path = require("path");
const fs = require('fs');
const folder = './public/img/product';

exports.index = (req, res, next) => {
    Product.findAll({ limit: 5 })
        .then(products => {
            res.render('shop/index', {
                data: products,
                pageTitle: 'Aroma Shop - Home',
                activeHome: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.create = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        activeAddProduct: true
    });
}

exports.store = (req, res, next) => {

    const title = req.body.product_title;
    const price = req.body.product_price;
    const description = req.body.product_description;
    const stock = req.body.product_stock;
    const sku = req.body.product_sku;
    const picture = req.body.product_picture;
    const absolutePathOfImage = path.resolve(folder, picture);

    Product.create({
        title: title,
        price: price,
        stock: stock,
        sku: sku,
        image: fs.readFileSync(absolutePathOfImage, 'base64'),
        description: description
    })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.show = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Products',
                activeProducts: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.fetchById = (req, res, next) => {
    const product_id = req.params.id;
    Product.findByPk(product_id)
        .then(product => {
            res.render('shop/single-product', {
                product: product,
                pageTitle: product.title,
                activeProducts: true
            })
        })
        .catch(err => {
            console.log(err);
        });
}

exports.edit = (req, res, next) => {
    const product_id = req.params.id;
    Product.findByPk(product_id)
        .then(product => {
            res.render('admin/edit-product', {
                product: product,
                pageTitle: 'Edit-' + product.title,
                activeAddProduct: true
            })
        })
        .catch(err => {
            console.log(err);
        });
}

exports.update = (req, res, next) => {
    const product_id = req.params.id;
    const new_title = req.body.product_title;
    const new_price = req.body.product_price;
    const new_description = req.body.product_description;
    const new_stock = req.body.product_stock;
    const new_sku = req.body.product_sku;
    const new_picture = req.body.product_picture;
    let absolutePathOfImage = null;

    if (new_picture !== null) {
        absolutePathOfImage = path.resolve(folder, new_picture);
    }

    Product.findByPk(product_id)
        .then(product => {
            product.title = new_title;
            product.price = new_price;
            product.description = new_description;
            product.stock = new_stock;
            product.sku = new_sku;
            if (absolutePathOfImage !== null) {  
                product.image = fs.readFileSync(absolutePathOfImage, 'base64');
            }
            return product.save();
        })
        .then( result => {
            res.redirect('/admin/products');
        } )
        .catch(err => {
            console.log(err);
        });
}

exports.delete = (req, res, next) => {
    const product_id = req.params.id;
    Product.findByPk(product_id)
        .then( product => {
            return product.destroy();
        })
        .then( result => {
            res.redirect('admin/products')
        })
        .catch(err => {
            console.log(err);
        });
}
