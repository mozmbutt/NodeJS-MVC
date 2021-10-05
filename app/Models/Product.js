const Sequelize = require('sequelize');
const sequelize = require('../../util/database');

const Product = sequelize.define('product' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    stock: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    sku: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = Product;