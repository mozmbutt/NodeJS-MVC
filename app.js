const express = require('express');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const webRoutes = require('./routes/web');
const bodyParser = require('body-parser');
const path = require('path');
const HomeController = require('./app/Http/Controllers/HomeController');
const sequelize = require('./util/database');

const Product = require('./app/Models/Product');
const User = require('./app/Models/User');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'vendors')));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use( (req, res, next) => {
    User.findByPk(1)
        .then( user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', shopRoutes);
app.use('/admin', authRoutes);
app.use(webRoutes);
app.use(HomeController.not_found_404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});

User.hasMany(Product);

sequelize.sync({ force: true })
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Moazzam',
                email: 'mozm@aroma.com',
            })
        }
        return user;
    })
    .then( () => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });