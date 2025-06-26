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

