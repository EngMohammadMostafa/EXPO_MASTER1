const express = require('express');              // استيراد مكتبة إكسبريس
const router = express.Router();                  // إنشاء راوتر جديد

const authController = require('../controllers/authController');  // استيراد كامل كنترولر المصادقة

const { register, login } = require('../controllers/authController'); // تفكيك دوال التسجيل وتسجيل الدخول

// مسار تسجيل مستخدم جديد
router.post('/register', register);

// مسار تسجيل دخول المستخدم
router.post('/login', login);

// مسار طلب إعادة تعيين كلمة المرور (نسيت كلمة المرور)
router.post('/forgot-password', authController.forgotPassword);

// مسار إعادة تعيين كلمة المرور بعد الحصول على التوكن
router.put('/reset-password', authController.resetPassword);

module.exports = router;  // تصدير الراوتر للاستخدام في التطبيق الرئيسي
