const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Product = sequelize.define('Product', {
  exhibitorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
   sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.FLOAT
  }
});
Product.belongsTo(User, { foreignKey: 'exhibitorId', as: 'exhibitor' });
Product.belongsTo(require('./Section'), { foreignKey: 'sectionId', as: 'section' });