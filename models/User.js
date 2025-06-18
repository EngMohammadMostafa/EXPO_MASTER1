// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const User = sequelize.define('User', {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING,
//     unique: true,
//     allowNull: false
//   },  
//   password: {
//     type: DataTypes.STRING
//   },
//   userType: {
//     type: DataTypes.INTEGER, 
//     allowNull: false,
//     defaultValue: 1  
//   }
// });

// // علاقته مع طلبات العارضين
// const ExhibitorRequest = require('./ExhibitorRequest');
// User.hasMany(ExhibitorRequest, { foreignKey: 'userId', as: 'requests' });

// module.exports = User;
// models/User.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING },
  userType: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  sequelize,
  modelName: 'User'
});

module.exports = User;
