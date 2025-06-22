const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { verifyExhibitor } = require('../middleware/authMiddleware');

// إضافة فعالية جديدة - مسموح فقط للعارض (exhibitor)
router.post('/add', verifyExhibitor, scheduleController.createSchedule);

// جلب جميع الفعاليات المرتبطة بقسم معين - متاح للزائرين بدون تحقق
router.get('/department/:departmentId', scheduleController.getSchedulesByDepartment);

module.exports = router;
