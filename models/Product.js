const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Product = sequelize.define('Product', {
  exhibitorId: {
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

// ✅ العلاقة مع العارض
Product.belongsTo(User, { foreignKey: 'exhibitorId', as: 'exhibitor' });

module.exports = Product;
