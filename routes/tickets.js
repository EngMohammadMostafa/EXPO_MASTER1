const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");

// حجز تذكرة + الدفع
router.post("/reserve", ticketController.reserveTicketAndPay);

module.exports = router;
