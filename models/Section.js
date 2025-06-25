const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Section = sequelize.define('Section', {
  name: { type: DataTypes.STRING(35), allowNull: false },
  departments_id: { type: DataTypes.INTEGER, allowNull: false },
  exhibitor_id: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Section;