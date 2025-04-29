const sequelize = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await sequelize.sync(); 

    const existing = await User.findOne({ where: { email: 'admin@expo.com' } });
    if (existing) {
      console.log('⚠️ مدير المعرض موجود مسبقًا.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('expoAdmin123', 10);  

    const admin = await User.create({
      name: 'Expo Master',
      email: 'admin@expo.com',
      password: hashedPassword,
      userType: 4  
    });

    console.log('✅ مدير المعرض تم إنشاؤه بنجاح:');
    console.log(admin.toJSON());

    process.exit();  
  } catch (error) {
    console.error('❌ فشل الإنشاء:', error.message);
    process.exit(1);  
  }
})();
