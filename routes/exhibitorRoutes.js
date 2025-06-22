const express = require('express');
const router = express.Router();
const exhibitorController = require('../controllers/exhibitorController');
const { verifyExhibitor } = require('../middleware/authMiddleware');

// ✅ مسار إنشاء الجناح - تحتاج حماية بواسطة verifyExhibitor بدل authMiddleware الغير معرف
router.post('/create-wing', verifyExhibitor, exhibitorController.createWing);

// ✅ حماية كل الراوتات التالية للعارض فقط
router.use(verifyExhibitor);

// ✅ منتجات العارض
router.post('/add-products', exhibitorController.addProduct);
router.get('/my-products', exhibitorController.getMyProducts);

// ✅ الطلبات والدفع
router.post('/create-request', exhibitorController.createRequest);
router.get('/track-request', exhibitorController.trackRequest);
router.post('/pay-initial', exhibitorController.payInitial);
router.post('/pay-final', exhibitorController.payFinal);

// ✅ إدارة الفعاليات (الجدول)
router.post('/add-schedule', exhibitorController.createSchedule);
router.put('/schedule/:id', exhibitorController.updateSchedule);
router.delete('/schedule/:id', exhibitorController.deleteSchedule);
router.get('/my-schedules', exhibitorController.getMySchedules);

module.exports = router;
