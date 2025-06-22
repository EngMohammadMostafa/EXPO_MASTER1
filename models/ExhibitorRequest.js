// const { DataTypes, Model } = require('sequelize');
// const sequelize = require('../config/db');
// const User = require('./User');
// const Department = require('./Department');
// const Section = require('./Section');

// class ExhibitorRequest extends Model {}

// ExhibitorRequest.init({
//   userId: { type: DataTypes.INTEGER, allowNull: false },
//   exhibitionName: { type: DataTypes.STRING, allowNull: false },
//   departmentId: { type: DataTypes.INTEGER, allowNull: false },
//   contactPhone: { type: DataTypes.STRING, allowNull: false },
//   notes: { type: DataTypes.TEXT, allowNull: true },
//   status: {
//     type: DataTypes.ENUM('waiting-approval', 'approved', 'rejected'),
//     allowNull: false,
//     defaultValue: 'waiting-approval'
//   },
//   paymentStatus: {
//     type: DataTypes.ENUM('unpaid', 'paid'),
//     allowNull: true,
//     defaultValue: 'unpaid'
//   },
//   finalPaymentStatus: {
//     type: DataTypes.ENUM('unpaid', 'paid'),
//     allowNull: true,
//     defaultValue: 'unpaid'
//   },
//   wingAssigned: {
//     type: DataTypes.BOOLEAN,
//     allowNull: true,
//     defaultValue: false
//   },
//   rejectionReason: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   sectionId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   finalPaymentDate: {
//     type: DataTypes.DATE,
//     allowNull: false
//   }
// }, {
//   sequelize,
//   modelName: 'ExhibitorRequest',
//   tableName: 'exhibitorrequests',
//   timestamps: true
// });

// // تعديل أسماء alias لتكون فريدة
// ExhibitorRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(ExhibitorRequest, { foreignKey: 'userId', as: 'exhibitorRequestsByUser' });

// ExhibitorRequest.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
// Department.hasMany(ExhibitorRequest, { foreignKey: 'departmentId', as: 'exhibitorRequestsByDepartment' });

// ExhibitorRequest.belongsTo(Section, { foreignKey: 'sectionId', as: 'requestSection' });
// Section.hasMany(ExhibitorRequest, { foreignKey: 'sectionId', as: 'exhibitorRequestsBySection' });

// module.exports = ExhibitorRequest;
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class ExhibitorRequest extends Model {}

ExhibitorRequest.init({
  userId: { type: DataTypes.INTEGER, allowNull: false },
  exhibitionName: { type: DataTypes.STRING, allowNull: false },
  departmentId: { type: DataTypes.INTEGER, allowNull: false },
  contactPhone: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  status: {
    type: DataTypes.ENUM('waiting-approval', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'waiting-approval'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid'),
    allowNull: true,
    defaultValue: 'unpaid'
  },
  finalPaymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid'),
    allowNull: true,
    defaultValue: 'unpaid'
  },
  wingAssigned: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  finalPaymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'ExhibitorRequest',
  tableName: 'exhibitorrequests',
  timestamps: true
});

module.exports = ExhibitorRequest;
