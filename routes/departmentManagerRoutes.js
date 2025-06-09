const express = require('express');
const router = express.Router();
const departmentManagerController = require('../controllers/departmentManagerController');
const authMiddleware = require('../middleware/auth'); // تأكد من وجوده للتحقق من المستخدم ومدير القسم

// حماية كل الراوتات
router.use(authMiddleware.verifyToken); // يضيف req.user تلقائيًا

// إدارة الأجنحة (sections)
router.get('/sections', departmentManagerController.getSectionsByDepartment);
router.delete('/sections/:id', departmentManagerController.deleteSection);
router.put('/sections/:id', departmentManagerController.updateSection);
router.post('/sections', departmentManagerController.createSection);

// جلب العارضين الذين أتموا الدفع النهائي
router.get('/confirmed-exhibitors', departmentManagerController.getConfirmedExhibitors);


// الطلبات (التقارير)
router.get('/requests', departmentManagerController.getExhibitorRequests);
router.put('/requests/accept/:id', departmentManagerController.acceptExhibitorRequest);
router.put('/requests/reject/:id', departmentManagerController.rejectExhibitorRequest);

module.exports = router;