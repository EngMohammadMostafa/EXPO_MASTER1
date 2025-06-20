const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const Section = require('./Section');

const Schedule = sequelize.define('Schedule', {
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sectionId: {
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

Schedule.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Schedule.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

module.exports = Schedule;
