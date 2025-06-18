// models/associations.js
const User = require('./User');
const ExhibitorRequest = require('./ExhibitorRequest');
const Department = require('./Department');
const Section = require('./Section');

// روابط ExhibitorRequest
ExhibitorRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ExhibitorRequest, { foreignKey: 'userId', as: 'requests' });

ExhibitorRequest.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
ExhibitorRequest.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

module.exports = {
  User,
  ExhibitorRequest,
  Department,
  Section
};
