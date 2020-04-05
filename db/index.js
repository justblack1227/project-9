const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fsjstd-restapi.db',
    // logging: false        //You can disable the Sequelize logging in the console
});

const db = {
    sequelize,
    sequelize, 
    models: {},
};

db.models.User = require('../models/user.js') (sequelize);
db.models.Course = require('../models/course.js') (sequelize);

module.exports = db; 
