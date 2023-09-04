const express = require('express');
const sequelize = require('./config/database.js');

var app = express();


const initializeDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync();
        console.log('Database models have been synchronized.');
    } catch (err) {
        console.error('Database error:', err);
    }
};

initializeDb();

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening in port ${port}`));