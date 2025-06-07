const express = require('express');
const router = express.Router();
const exhibitorController = require('../controllers/exhibitorController');
const { verifyExhibitor } = require('../middleware/authMiddleware');

router.post('/pay-initial', verifyExhibitor, exhibitorController.payInitial);


// إنشاء طلب
router.post('/create-request', verifyExhibitor, exhibitorController.createRequest);

// دفع مبدئي
router.post('/pay-initial', verifyExhibitor, exhibitorController.payInitial);

// متابعة الطلب
router.get('/track-request', verifyExhibitor, exhibitorController.trackRequest);

// دفع نهائي
router.post('/pay-final', verifyExhibitor, exhibitorController.payFinal);

// إضافة المنتجات
router.post('/add-products', verifyExhibitor, exhibitorController.addProducts);

module.exports = router;
