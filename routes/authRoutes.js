const express = require('express');
const router = express.Router();

// استيراد كل الدوال مرة واحدة
const authController = require('../controllers/authController');

// استخدام الدوال من الكائن
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;
