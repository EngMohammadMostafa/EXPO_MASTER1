const express = require('express');           // استيراد مكتبة إكسبريس
const router = express.Router();               // إنشاء راوتر جديد

const { register } = require('../controllers/authController'); // استيراد دالة التسجيل
const { verifyToken, authorize } = require('../middleware/authMiddleware'); // استيراد ميدل وير التحقق والتفويض

// مسار لإنشاء مدير جديد (فقط مدراء المعرض - userType=4 يسمح لهم)
router.post('/add-manager', verifyToken, authorize(4), register);

// مسار لوحة تحكم المدير (محمية بالتوكن وصلاحية المدير فقط)
router.get('/dashboard', verifyToken, authorize(4), (req, res) => {
  res.status(200).json({ message: 'لوحة تحكم مدير المعرض' });
});

module.exports = router;  // تصدير الراوتر للاستخدام في التطبيق الرئيسي
