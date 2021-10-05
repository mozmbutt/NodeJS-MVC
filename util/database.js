const mysql = require('mysql2');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'aroma_db',
    'root',
    '',
    {
        dialect: 'mysql',
        host: 'localhost'
    }
);

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'aroma_db',
//     password: ''
// });

module.exports = sequelize;