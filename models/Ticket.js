// models/Ticket.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');  // تأكد أنك مهيأ اتصال Sequelize هنا

class Ticket extends Model {}

Ticket.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  purchaseDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // pending, paid, used
  }
}, {
  sequelize,
  modelName: 'Ticket',
  tableName: 'tickets',
  timestamps: false,
});

module.exports = Ticket;
