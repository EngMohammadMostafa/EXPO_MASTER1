// const express = require('express');
// const router = express.Router();
// const { verifyToken, authorize } = require('../middleware/authMiddleware');
// const { getSectionsByDepartment, getProductsBySection } = require('../controllers/visitorController');

// // ✅ التحقق من أن المستخدم زائر (userType = 1)
// router.use(verifyToken);
// router.use(authorize(1));

// // ✅ عرض أجنحة القسم
// router.get('/sections/:departmentId', getSectionsByDepartment);

// // ✅ عرض منتجات الجناح
// router.get('/products/:sectionId', getProductsBySection);

// module.exports = router;

const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const authMiddleware = require("../middlewares/authMiddleware");
const verifyVisitor = require("../middlewares/verifyVisitor");

// ✅ عرض الأجنحة في قسم معيّن
router.get("/sections/:departmentId", authMiddleware, verifyVisitor, visitorController.getSectionsByDepartment);

// ✅ عرض المنتجات في جناح معيّن
router.get("/products/:sectionId", authMiddleware, verifyVisitor, visitorController.getProductsBySection);

// ✅ شراء تذكرة
router.post("/buy-ticket", authMiddleware, verifyVisitor, visitorController.buyTicket);

// ✅ التحقق من وجود تذكرة
router.get("/check-ticket/:departmentId", authMiddleware, verifyVisitor, visitorController.checkTicket);

module.exports = router;
