const express = require('express');          // استيراد مكتبة إكسبريس
const cors = require('cors');                  // استيراد مكتبة CORS للسماح بطلبات من دومينات مختلفة
const sequelize = require('./config/db');     // استيراد إعدادات قاعدة البيانات
require('dotenv').config();                     // تحميل متغيرات البيئة من ملف .env

// إنشاء تطبيق إكسبريس
const app = express();

// تفعيل CORS للسماح بالطلبات من كل المصادر، وتفعيل قراءة بيانات JSON من جسم الطلب
app.use(cors());
app.use(express.json());

// استيراد الموديلات حتى يتم تسجيلها لدى sequelize (ضروري للعلاقات)
require('./models/User');
require('./models/ExhibitorRequest');
require('./models/Department');
require('./models/Section');

// استيراد تعريف العلاقات بين الموديلات
require('./models/associations');

// استيراد ملفات الراوتس (Routes) لكل وحدة
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const exhibitorRoutes = require('./routes/exhibitorRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

// تسجيل الراوتس في التطبيق مع توضيح وظيفتها
app.use('/auth', authRoutes);                  // مسارات التسجيل وتسجيل الدخول
app.use('/admin', adminRoutes);                // مسارات إدارة النظام (مدير المعرض)
app.use('/api/exhibitor', exhibitorRoutes);   // مسارات العارضين
app.use('/departments', departmentRoutes);    // إدارة الأقسام
app.use('/api/schedules', scheduleRoutes);    // إدارة الفعاليات والجدول

// تحديد المنفذ من ملف البيئة أو الافتراضي 3000
const PORT = process.env.PORT || 3000;

// مزامنة قاعدة البيانات مع الجداول (تحديث تلقائي) وتشغيل السيرفر
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to the database:', err.message);
});
