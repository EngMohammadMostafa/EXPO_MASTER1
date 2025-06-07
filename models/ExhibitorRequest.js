// models/ExhibitorRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExhibitorRequest = sequelize.define('ExhibitorRequest', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exhibitionName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // أو values مثل: pending / approved / rejected
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentStatus: {
  type: DataTypes.STRING,
  defaultValue: 'unpaid' // أو 'paid'
},
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = ExhibitorRequest;
