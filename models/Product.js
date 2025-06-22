const { DataTypes } = require('sequelize');   // استيراد أنواع البيانات من Sequelize
const sequelize = require('../config/db');    // استيراد إعداد اتصال قاعدة البيانات
const User = require('./User');                // استيراد موديل المستخدم

// تعريف موديل المنتج
const Product = sequelize.define('Product', {
  exhibitorId: {                             // معرف العارض (مالك المنتج)
    type: DataTypes.INTEGER,
    allowNull: false                         // مطلوب
  },
  sectionId: {                              // معرف الجناح (القسم) الذي ينتمي له المنتج
    type: DataTypes.INTEGER,
    allowNull: false                         // مطلوب
  },
  productName: {                            // اسم المنتج
    type: DataTypes.STRING,
    allowNull: false                         // مطلوب
  },
  description: {                            // وصف المنتج (اختياري)
    type: DataTypes.TEXT
  },
  price: {                                 // سعر المنتج (اختياري)
    type: DataTypes.FLOAT
  }
});

// إنشاء علاقة belongsTo مع الموديل User باستخدام مفتاح أجنبي exhibitorId
Product.belongsTo(User, { foreignKey: 'exhibitorId', as: 'exhibitor' });

// إنشاء علاقة belongsTo مع موديل Section باستخدام مفتاح أجنبي sectionId
Product.belongsTo(require('./Section'), { foreignKey: 'sectionId', as: 'section' });

module.exports = Product;  // تصدير موديل المنتج للاستخدام في باقي أجزاء التطبيق
