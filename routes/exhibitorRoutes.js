const express = require('express');
const router = express.Router();
const exhibitorController = require('../controllers/exhibitorController');
const { verifyExhibitor } = require('../middleware/authMiddleware');

// ✅ حماية المسارات للعارض فقط
router.use(verifyExhibitor);

// ✅ منتجات العارض
router.post('/add-products', exhibitorController.addProduct);
router.get('/my-products', exhibitorController.getMyProducts);

// ✅ الطلبات والدفع
router.post('/create-request', exhibitorController.createRequest);
router.get('/track-request', exhibitorController.trackRequest);
router.post('/pay-initial', exhibitorController.payInitial);
router.post('/pay-final', exhibitorController.payFinal);

module.exports = router;
