const express = require('express');
const router = express.Router();
const { sendQRToUser } = require('../controllers/qrController');
const { verifyToken } = require('../middlewares/authMiddleware'); // لو عندك JWT middleware

// إرسال QR بعد الدفع
router.post('/send-qr/:ticketId', verifyToken, sendQRToUser);

module.exports = router;
