const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const { getSectionsByDepartment, getProductsBySection } = require('../controllers/visitorController');

// ✅ التحقق من أن المستخدم زائر (userType = 1)
router.use(verifyToken);
router.use(authorize(1));

// ✅ عرض أجنحة القسم
router.get('/sections/:departmentId', getSectionsByDepartment);

// ✅ عرض منتجات الجناح
router.get('/products/:sectionId', getProductsBySection);

module.exports = router;