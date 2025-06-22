const express = require('express');
const router = express.Router();
const departmentManagerController = require('../controllers/departmentManagerController');
const authMiddleware = require('../middleware/auth');

// ✅ حماية جميع الراوتات عبر التوكن باستخدام Middleware للتحقق من التوكن
router.use(authMiddleware.verifyToken);

// ✅ إدارة الأجنحة (Sections)
// جلب جميع الأجنحة التابعة للقسم
router.get('/sections', departmentManagerController.getSectionsByDepartment);

// إنشاء جناح جديد
router.post('/sections', departmentManagerController.createSection);

// تحديث بيانات جناح معين بناءً على المعرف (ID)
router.put('/sections/:id', departmentManagerController.updateSection);

// حذف جناح معين
router.delete('/sections/:id', departmentManagerController.deleteSection);

// رفض طلب عارض معين بناءً على معرف الطلب
// إضافة Middleware التحقق من التوكن مكرر هنا غير ضروري لأننا استخدمنا router.use أعلاه
router.post('/exhibitor-requests/:requestId/reject', departmentManagerController.rejectRequest);

// ✅ جلب العارضين الذين أكملوا الدفع النهائي
router.get('/confirmed-exhibitors', departmentManagerController.getConfirmedExhibitors);

// ✅ إدارة طلبات العارضين
// جلب جميع طلبات العارضين
router.get('/requests', departmentManagerController.getExhibitorRequests);

// قبول طلب عارض معين
router.put('/requests/accept/:id', departmentManagerController.acceptExhibitorRequest);

// رفض طلب عارض معين
router.put('/requests/reject/:id', departmentManagerController.rejectExhibitorRequest);

module.exports = router;
