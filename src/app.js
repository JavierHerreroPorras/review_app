// Initialize config env vars
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database.js');
const configureRoutes = require('./routes/base.js');

var app = express();

// set view engine to ejs
app.set('view engine', 'ejs');
app.set('views', 'src/templates');

app.use(bodyParser.urlencoded({ extended: true }));


const initializeDb = async () => {
    try {
        await sequelize.authenticate();
        //console.log('Database connection has been established successfully.');
        await sequelize.sync();
        //console.log('Database models have been synchronized.');
    } catch (err) {
        console.error('Database error:', err);
    }
};

initializeDb();

configureRoutes(app);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening in port ${port}`));

module.exports = app;