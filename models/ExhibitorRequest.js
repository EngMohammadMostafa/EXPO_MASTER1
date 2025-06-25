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
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'ExhibitorRequest',
  tableName: 'exhibitorrequests',
  timestamps: true
});

module.exports = ExhibitorRequest;