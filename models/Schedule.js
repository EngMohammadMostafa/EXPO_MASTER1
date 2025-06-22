const { DataTypes } = require('sequelize');  // استيراد أنواع البيانات من Sequelize
const sequelize = require('../config/db');   // استيراد إعداد الاتصال بقاعدة البيانات
const Department = require('./Department');  // استيراد موديل القسم
const Section = require('./Section');        // استيراد موديل الجناح (القسم الفرعي)

// تعريف موديل Schedule (الفعالية أو الجدول الزمني)
const Schedule = sequelize.define('Schedule', {
  departmentId: {                            // مفتاح أجنبي يشير لقسم الفعالية
    type: DataTypes.INTEGER,
    allowNull: false,                        // مطلوب وجوده دائماً
  },
  sectionId: {                              // مفتاح أجنبي يشير للجناح أو القسم الفرعي
    type: DataTypes.INTEGER,
    allowNull: false,                        // مطلوب دائماً
  },
  eventTitle: {                             // عنوان الفعالية
    type: DataTypes.STRING,
    allowNull: false,                        // مطلوب
  },
  eventDate: {                             // تاريخ ووقت الفعالية
    type: DataTypes.DATE,
    allowNull: false,                        // مطلوب
  },
});

// تعريف علاقة belongsTo مع موديل Department عبر المفتاح departmentId
Schedule.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

// تعريف علاقة belongsTo مع موديل Section عبر المفتاح sectionId
Schedule.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

module.exports = Schedule;  // تصدير الموديل للاستخدام في أماكن أخرى
