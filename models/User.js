const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING
  },
  userType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  }
});

module.exports = User;
