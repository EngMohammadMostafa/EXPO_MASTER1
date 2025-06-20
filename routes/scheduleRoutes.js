const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { verifyExhibitor } = require('../middleware/authMiddleware');

//  إضافة فعالية  للعارض فقط
router.post('/add', verifyExhibitor, scheduleController.createSchedule);

//  عرض الفعاليات لقسم معين  للزائرين
router.get('/department/:departmentId', scheduleController.getSchedulesByDepartment);

module.exports = router;
