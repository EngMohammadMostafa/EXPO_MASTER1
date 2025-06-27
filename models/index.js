const User = require('./User');
const Department = require('./Department');
const Section = require('./Section');
const ExhibitorRequest = require('./ExhibitorRequest');
const Product = require('./Product');
const Ticket = require('./Ticket');

// علاقات ExhibitorRequest
User.hasMany(ExhibitorRequest, { foreignKey: 'userId', as: 'exhibitorRequestsByUser' });
ExhibitorRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Department.hasMany(ExhibitorRequest, { foreignKey: 'departmentId', as: 'exhibitorRequestsByDepartment' });
ExhibitorRequest.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// حذف العلاقة القديمة التي تعتمد على sectionId
// Section.hasMany(ExhibitorRequest, { foreignKey: 'sectionId', as: 'exhibitorRequestsBySection' });
// ExhibitorRequest.belongsTo(Section, { foreignKey: 'sectionId', as: 'requestSection' });

// إضافة علاقة جديدة تربط Section بـ ExhibitorRequest عبر exhibitorRequestId
Section.belongsTo(ExhibitorRequest, { foreignKey: 'exhibitorRequestId', as: 'exhibitorRequest' });
ExhibitorRequest.hasOne(Section, { foreignKey: 'exhibitorRequestId', as: 'section' });

// علاقات Product
User.hasMany(Product, { foreignKey: 'exhibitorId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'exhibitorId', as: 'exhibitor' });

Section.hasMany(Product, { foreignKey: 'sectionId', as: 'products' });
Product.belongsTo(Section, { foreignKey: 'sectionId', as: 'productSection' });

// علاقات Ticket
User.hasMany(Ticket, { foreignKey: 'userId', as: 'tickets' });
Ticket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Department.hasMany(Ticket, { foreignKey: 'departmentId', as: 'tickets' });
Ticket.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });


module.exports = {
  User,
  Department,
  Section,
  ExhibitorRequest,
  Product,
  Ticket
};