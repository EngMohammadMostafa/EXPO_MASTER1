const { DataTypes } = require('sequelize'); // استيراد أنواع البيانات من sequelize
const sequelize = require('../config/db');  // استيراد اتصال قاعدة البيانات

const Department = sequelize.define('Department', {
  name: {
    type: DataTypes.STRING(25),  // اسم القسم نص بطول أقصى 25 حرف
    allowNull: false,            // الحقل مطلوب ولا يمكن أن يكون فارغاً
  },
  startDate: {
    type: DataTypes.DATE,        // تاريخ بداية القسم
    allowNull: false,            // مطلوب
  },
  endDate: {
    type: DataTypes.DATE,        // تاريخ نهاية القسم
    allowNull: false,            // مطلوب
  },
  managerId: {
    type: DataTypes.INTEGER,     // رقم معرف المدير (إذا كان موجوداً)
    allowNull: true,             // يمكن أن يكون فارغاً
  },
  description: {
    type: DataTypes.TEXT,        // وصف نصي للقسم (اختياري)
    allowNull: true,
  },
}, {
  underscored: true,             // يجعل أسماء الأعمدة في قاعدة البيانات مثل start_date بدلاً من startDate
});

module.exports = Department; // تصدير الموديل للاستخدام في مكان آخر
