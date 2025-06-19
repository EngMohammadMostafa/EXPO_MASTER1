const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/TicketController');
const { verifyToken } = require('../middleware/authMiddleware'); // Middleware تحقق المستخدم

// إنشاء تذكرة - الدفع وهمي (يحتاج تسجيل دخول)
router.post('/purchase', verifyToken, TicketController.createTicket);

// تأكيد الدفع (وهمي)
router.post('/confirm-payment', verifyToken, TicketController.confirmPayment);

// عرض تذاكر المستخدم
router.get('/my-tickets', verifyToken, TicketController.listTickets);

module.exports = router;
