'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id: { 
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: { 
            type: Sequelize.STRING, 
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide a first name'
                },
                notEmpty: { 
                    msg: 'Please provide a first name'
                }
            }
        },
        lastName: { 
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide a last name'
                },
                notEmpty: { 
                    msg: 'Please provide a last name'
                }
            }
        },
        emailAddress: { 
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide an email address'
                },
                notEmpty: { 
                    msg: 'Please provide a email address'
                }, 
                isEmail: {
                    msg: 'Invalid email format. Please correct email'
                }
                    
            }
        }, 
        password: { 
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: { 
                    msg: 'Please provide a password'
                },
                notEmpty: { 
                    msg: 'Please provide a password'
                }
            }
        }, 
    }, { sequelize });

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: { 
                fieldName: 'userId', 
                allowNull: false,
                validate: {
                    notNull: { 
                        msg: 'Please provide an user Id'
                    },
                    notEmpty: { 
                        msg: 'Please provide an user Id'
                    }
                }
            },
        });
    };

    return User;
};