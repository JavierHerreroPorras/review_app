const { Sequelize } = require('sequelize');

var database = 'prod_database.db'

if (process.env.NODE_ENV === 'test'){
    database = 'test_database.db'
}

// Define database connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: database,
    logging: false
});

module.exports = sequelize;