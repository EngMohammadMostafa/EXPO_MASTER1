const User = require('./User');
const Department = require('./Department');
const Section = require('./Section');
const ExhibitorRequest = require('./ExhibitorRequest');
const Product = require('./Product');

// علاقات ExhibitorRequest
User.hasMany(ExhibitorRequest, { foreignKey: 'userId', as: 'exhibitorRequestsByUser' });
ExhibitorRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Department.hasMany(ExhibitorRequest, { foreignKey: 'departmentId', as: 'exhibitorRequestsByDepartment' });
ExhibitorRequest.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

Section.hasMany(ExhibitorRequest, { foreignKey: 'sectionId', as: 'exhibitorRequestsBySection' });
ExhibitorRequest.belongsTo(Section, { foreignKey: 'sectionId', as: 'requestSection' });

// علاقات Product
User.hasMany(Product, { foreignKey: 'exhibitorId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'exhibitorId', as: 'exhibitor' });

Section.hasMany(Product, { foreignKey: 'sectionId', as: 'products' });
Product.belongsTo(Section, { foreignKey: 'sectionId', as: 'productSection' });

module.exports = {
  User,
  Department,
  Section,
  ExhibitorRequest,
  Product
};
