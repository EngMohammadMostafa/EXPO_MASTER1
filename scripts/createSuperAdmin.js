const sequelize = require('../config/db'); // استيراد إعدادات اتصال قاعدة البيانات
const User = require('../models/User');   // استيراد موديل المستخدم
const bcrypt = require('bcryptjs');       // مكتبة لتشفير كلمات المرور

(async () => {
  try {
    await sequelize.sync(); // مزامنة الموديلات مع قاعدة البيانات (إنشاء الجداول إذا لم تكن موجودة)

    // تحقق إذا كان مدير المعرض موجود مسبقًا بناءً على البريد الإلكتروني
    const existing = await User.findOne({ where: { email: 'admin@expo.com' } });
    if (existing) {
      console.log('⚠️ مدير المعرض موجود مسبقًا.');
      process.exit(0); // إنهاء السكربت بدون خطأ
    }

    // تشفير كلمة المرور قبل تخزينها
    const hashedPassword = await bcrypt.hash('expoAdmin123', 10);

    // إنشاء حساب مدير المعرض الجديد مع النوع userType = 4
    const admin = await User.create({
      name: 'Expo Master',
      email: 'admin@expo.com',
      password: hashedPassword,
      userType: 4 // مدير المعرض
    });

    console.log('✅ مدير المعرض تم إنشاؤه بنجاح:');
    console.log(admin.toJSON()); // عرض بيانات المدير الجديد

    process.exit(0); // إنهاء السكربت بنجاح
  } catch (error) {
    console.error('❌ فشل الإنشاء:', error.message);
    process.exit(1); // إنهاء السكربت بخطأ
  }
})();
