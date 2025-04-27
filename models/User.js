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
    type: DataTypes.INTEGER, // 1: زائر، 2: عارض، 3: مدير قسم، 4: مدير معرض
    allowNull: false,
    defaultValue: 1 // الزائر كخيار افتراضي
  }
});

module.exports = User;
