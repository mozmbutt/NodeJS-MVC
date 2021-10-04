const express = require('express');
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const webRoutes = require('./routes/web');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'vendors')));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', shopRoutes.router);
app.use('/admin', authRoutes);
app.use(webRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: '404 - Page Not Found'
    });
})

app.listen(8000);