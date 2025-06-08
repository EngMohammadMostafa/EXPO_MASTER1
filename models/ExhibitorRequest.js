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
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'waiting-approval', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid'),
    defaultValue: 'unpaid'
  },
  finalPaymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid'),
    defaultValue: 'unpaid'
  },
  wingAssigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = ExhibitorRequest;
