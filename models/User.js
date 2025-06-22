const { DataTypes, Model } = require('sequelize');  // استيراد Model وأنواع البيانات من Sequelize
const sequelize = require('../config/db');         // استيراد اتصال قاعدة البيانات

// تعريف الكلاس User كـ Model
class User extends Model {}

// تهيئة موديل User مع الحقول والخصائص
User.init({
  name: {                           // اسم المستخدم (إلزامي)
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: {                          // البريد الإلكتروني (إلزامي ويجب أن يكون فريد)
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  password: {                      // كلمة المرور (اختياري هنا، عادة تكون مطلوبة)
    type: DataTypes.STRING 
  },
  userType: {                     // نوع المستخدم (رقم يمثل الصلاحية، افتراضياً 1)
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1 
  }
}, {
  sequelize,                      // ربط الموديل باتصال قاعدة البيانات
  modelName: 'User'              // اسم الموديل داخل Sequelize
});

module.exports = User;            // تصدير الموديل للاستخدام في باقي التطبيق
