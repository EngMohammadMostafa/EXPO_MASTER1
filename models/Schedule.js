const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Schedule = sequelize.define('Schedule', {
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Schedule;