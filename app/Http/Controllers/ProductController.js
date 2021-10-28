const Product = require('../../Models/Product');
const Order = require('../../Models/Order');
const path = require("path");
const fs = require('fs');
const folder = './public/img/product';

exports.index = (req, res, next) => {
    Product.findAll({ limit: 5 })
        .then(products => {
            res.render('shop/index', {
                data: products,
                pageTitle: 'Aroma Shop - Home',
                activeHome: true,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.create = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        activeAddProduct: true,
        isAuthenticated: req.session.isLoggedIn
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

    req.user.createProduct({
        title: title,
        price: price,
        stock: stock,
        sku: sku,
        image: fs.readFileSync(absolutePathOfImage, 'base64'),
        description: description
    })
        .then(result => {
            return res.redirect('/admin/products');
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
                activeProducts: true,
                isAuthenticated: req.session.isLoggedIn
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
                activeProducts: true,
                isAuthenticated: req.session.isLoggedIn
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
                activeAddProduct: true,
                isAuthenticated: req.session.isLoggedIn
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

    if (new_picture !== '') {
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
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.delete = (req, res, next) => {
    const product_id = req.params.id;
    Product.findByPk(product_id)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.cart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        products: products,
                        pageTitle: 'Cart',
                        activeCart: true,
                        isAuthenticated: req.session.isLoggedIn
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.addToCart = (req, res, next) => {
    
    const product_id = req.body.product_id;
    let new_quantity = req.body.qty;
    let fetchedCart;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: product_id } })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                let oldQuantity = product.cart_item.quantity;
                new_quantity = parseInt(oldQuantity) + parseInt(new_quantity);
            }

            return Product.findByPk(product_id)
                .then(product => {
                    
                    return fetchedCart
                        .addProduct(product, {
                            through: {
                                quantity: new_quantity
                            }
                        })
                })
                .then(() => {
                    
                    res.redirect('/cart');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deleteFromCart = (req , res , next) => { 
    const product_id = req.body.product_id;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: product_id } })
        })
        .then(products => {
            const product = products[0];
            product.cart_item.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch( err => {
            console.log(err);
        })
}

exports.proceedToCheckout = (req, res, next) => {
    let fetchedcart ;
    req.user.getCart()
    .then( cart => {
        fetchedcart = cart;
        return cart.getProducts();
    })
    .then( products => {
        return req.user.createOrder()
        .then(order => {
            order.addProduct(products.map(product => {
                product.order_item = {
                    quantity: product.cart_item.quantity
                };
                return product;
            }))
        })
        .then( result => {
            return fetchedcart.setProducts(null);
        })
        .then( result => {
            res.render('shop/checkout', {
                pageTitle: 'Checkout',
                products: products,
                shipping_rate: 50,
                activeCheckout: true,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch( err => {
            console.log(err);
        })
        
    })
    .catch( err => {
        console.log(err);
    })
}

exports.getAllOrders = (req, res, next) => {
    req.user.getOrders({include: 'products'})
    .then((orders) => {
        console.log(orders[0].products[0].title);
        res.render('shop/orders', {
            pageTitle: 'Orders',
            orders: orders,
            activeOrders: true,
            isAuthenticated: req.session.isLoggedIn
        });
    }).catch((err) => {
        console.log(err);
    });
}