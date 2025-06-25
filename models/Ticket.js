const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ticket = sequelize.define('Ticket', {
  userId: { type: DataTypes.INTEGER, allowNull: false }, // الزائر
  departmentId: { type: DataTypes.INTEGER, allowNull: false }, // القسم الذي ضغط عليه
  entryDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
});

module.exports = Ticket;