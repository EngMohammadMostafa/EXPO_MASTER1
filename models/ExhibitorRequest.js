const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
 
const ExhibitorRequest = sequelize.define('ExhibitorRequest', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  exhibitionName: { type: DataTypes.STRING, allowNull: false },
  departmentId: { type: DataTypes.INTEGER, allowNull: false },
  contactPhone: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.TEXT },
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
  finalPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  wingAssigned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

// ✅ التعريف الصحيح للعلاقات
ExhibitorRequest.associate = (models) => {
  ExhibitorRequest.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  ExhibitorRequest.belongsTo(models.Department, { foreignKey: 'departmentId', as: 'department' });
  ExhibitorRequest.belongsTo(models.Section, { foreignKey: 'sectionId', as: 'section' });
};

module.exports = ExhibitorRequest;