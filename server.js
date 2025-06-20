const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

// إنشاء تطبيق إكسبريس
const app = express();

// تفعيل CORS و JSON body parsing
app.use(cors());
app.use(express.json());

// استيراد الموديلات (حتى يتم تعريفها)
require('./models/User');
require('./models/ExhibitorRequest');
require('./models/Department');
require('./models/Section');

// استيراد العلاقات بين الموديلات
require('./models/associations');

// استيراد الراوتس
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const exhibitorRoutes = require('./routes/exhibitorRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

// تسجيل الراوتس مع إضافة تعليقات تفصيلية
app.use('/departments', departmentRoutes);          // إدارة الأقسام
app.use('/auth', authRoutes);                        // عمليات التسجيل وتسجيل الدخول
app.use('/admin', adminRoutes);                      // واجهات مدير النظام
app.use('/api/exhibitor', exhibitorRoutes);         // واجهات العارضين
app.use('/api/schedules', scheduleRoutes);           // واجهات الفعاليات (الجدول)

// تحديد المنفذ
const PORT = process.env.PORT || 3000;

// مزامنة قاعدة البيانات وتشغيل السيرفر
sequelize.sync();
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to the database:', err.message);
});
