const { DataTypes, Model } = require('sequelize');  // استيراد DataTypes و Model من Sequelize
const sequelize = require('../config/db');         // استيراد اتصال قاعدة البيانات

class ExhibitorRequest extends Model {}               // تعريف كلاس موديل جديد باسم ExhibitorRequest

ExhibitorRequest.init({
  userId: { 
    type: DataTypes.INTEGER,                         // معرف المستخدم (مالك الطلب)
    allowNull: false                                 // مطلوب
  },
  exhibitionName: { 
    type: DataTypes.STRING,                          // اسم المعرض
    allowNull: false                                 // مطلوب
  },
  departmentId: { 
    type: DataTypes.INTEGER,                         // معرف القسم المرتبط بالطلب
    allowNull: false                                 // مطلوب
  },
  contactPhone: { 
    type: DataTypes.STRING,                          // رقم هاتف للتواصل
    allowNull: false                                 // مطلوب
  },
  notes: { 
    type: DataTypes.TEXT                             // ملاحظات إضافية (اختياري)
  },
  status: {
    type: DataTypes.ENUM('pending', 'waiting-approval', 'approved', 'rejected'),  // حالة الطلب
    defaultValue: 'pending'                          // القيمة الافتراضية هي "قيد الانتظار"
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid'),         // حالة الدفعة الأولى
    defaultValue: 'unpaid'                           // القيمة الافتراضية "غير مدفوعة"
  },
  finalPaymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid'),         // حالة الدفعة النهائية
    defaultValue: 'unpaid'                           // القيمة الافتراضية "غير مدفوعة"
  },
  finalPaymentDate: { 
    type: DataTypes.DATE,                            // تاريخ دفع الدفعة النهائية
    allowNull: true                                  // تعديل: ليس مطلوبًا دائماً لأن الدفع قد لا يتم فوراً
  },
  wingAssigned: { 
    type: DataTypes.BOOLEAN,                         // هل تم تعيين جناح (جناح موجود)
    defaultValue: false                              // القيمة الافتراضية: لا يوجد جناح
  },
  rejectionReason: { 
    type: DataTypes.TEXT,                            // سبب الرفض (اختياري)
    allowNull: true
  },
  sectionId: { 
    type: DataTypes.INTEGER,                         // معرف الجناح (القسم)
    allowNull: false                                 // مطلوب
  }
}, {
  sequelize,                                        // الربط مع اتصال قاعدة البيانات
  modelName: 'ExhibitorRequest',                    // اسم الموديل داخل sequelize
  underscored: true                                 // لجعل أسماء الأعمدة في قاعدة البيانات snake_case مثل final_payment_date
});

module.exports = ExhibitorRequest;                   // تصدير الموديل للاستخدام
