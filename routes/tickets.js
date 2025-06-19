const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const authenticateToken = require("../middleware/auth"); // تحقق من تسجيل الدخول

router.post("/buy", authenticateToken, ticketController.buyTicket);

module.exports = router;
