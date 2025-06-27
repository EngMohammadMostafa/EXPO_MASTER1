const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const { verifyToken, verifyVisitor } = require("../middleware/authMiddleware");

// ✅ عرض الأجنحة في قسم معيّن
router.get("/sections/:departmentId", verifyToken, verifyVisitor, visitorController.getSectionsByDepartment);

// ✅ عرض المنتجات في جناح معيّن
router.get("/products/:sectionId", verifyToken, verifyVisitor, visitorController.getProductsBySection);

// ✅ شراء تذكرة
router.post("/buy-ticket", verifyToken, verifyVisitor, visitorController.buyTicket);

// ✅ التحقق من وجود تذكرة
router.get("/check-ticket/:departmentId", verifyToken, verifyVisitor, visitorController.checkTicket);

module.exports = router;

