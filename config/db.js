// استيراد كائن Sequelize من مكتبة sequelize
const { Sequelize } = require('sequelize');

// تحميل المتغيرات البيئية من ملف .env
require('dotenv').config();

// إنشاء كائن الاتصال بقاعدة البيانات باستخدام Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     // اسم قاعدة البيانات
  process.env.DB_USER,     // اسم المستخدم
  process.env.DB_PASSWORD, // كلمة المرور
  {
    host: process.env.DB_HOST, // المضيف (عادة localhost أو IP)
    dialect: 'mysql',          // نوع قاعدة البيانات
    logging: false             // إيقاف إظهار استعلامات SQL في الكونسول
  }
);

// اختبار الاتصال بقاعدة البيانات
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// تصدير كائن sequelize لاستخدامه في أجزاء أخرى من التطبيق
module.exports = sequelize;
