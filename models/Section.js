const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Department = require('./Department');
const User = require('./User');

const Section = sequelize.define('Section', {
  name: {
    type: DataTypes.STRING(35),
    allowNull: false,
  },
  departments_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  exhibitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// ✅ العلاقات
Section.belongsTo(Department, { foreignKey: 'departments_id', as: 'department' });
Section.belongsTo(User, { foreignKey: 'exhibitor_id', as: 'exhibitor' });

module.exports = Section;
