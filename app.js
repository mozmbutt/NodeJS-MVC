//node packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);

//project files
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const webRoutes = require('./routes/web');
const Product = require('./app/Models/Product');
const User = require('./app/Models/User');
const Cart = require('./app/Models/Cart');
const CartItem = require('./app/Models/CartItem');
const Order = require('./app/Models/Order');
const OrderItem = require('./app/Models/OrderItem');
const HomeController = require('./app/Http/Controllers/HomeController');
const sequelize = require('./util/database');

const sequelizeSessionStore = new SessionStore({
    db: sequelize,
});
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'vendors')));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: 'keep it secret, keep it safe.',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));


app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findByPk(req.session.user.id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', shopRoutes);
app.use('/admin', authRoutes);
app.use(webRoutes);
app.use(HomeController.not_found_404);

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
Product.belongsToMany(Cart, {
    through: CartItem
});

Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem
});

Order.belongsTo(User);
Order.belongsToMany(Product, {
    through: OrderItem
})

sequelize.sync()
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });