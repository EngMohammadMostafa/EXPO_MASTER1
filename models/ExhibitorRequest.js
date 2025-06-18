
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class ExhibitorRequest extends Model {}

ExhibitorRequest.init({
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
  finalPaymentDate: { type: DataTypes.DATE, allowNull: false   },
  wingAssigned: { type: DataTypes.BOOLEAN, defaultValue: false },
  rejectionReason: { type: DataTypes.TEXT, allowNull: true },
  sectionId: { type: DataTypes.INTEGER, allowNull: false   }
}, {
  sequelize,
  modelName: 'ExhibitorRequest'
});

module.exports = ExhibitorRequest;
