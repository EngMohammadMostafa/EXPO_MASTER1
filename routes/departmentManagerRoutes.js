const express = require('express');
const router = express.Router();
const departmentManagerController = require('../controllers/departmentManagerController');
const authMiddleware = require('../middleware/auth'); // تأكد من وجوده للتحقق من المستخدم ومدير القسم

// حماية كل الراوتات
router.use(authMiddleware.verifyToken); // يضيف req.user تلقائيًا
