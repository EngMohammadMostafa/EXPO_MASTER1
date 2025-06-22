const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const {
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
} = require('../controllers/departmentController');

// ✅ حماية جميع المسارات: التحقق من التوكن والتأكد من أن المستخدم هو مدير المدينة (userType = 4)
router.use(verifyToken);
router.use(authorize(4));

// جلب جميع الأقسام
router.get('/', getAllDepartments);

// إنشاء قسم جديد
router.post('/', createDepartment);

// جلب قسم معين عبر المعرف
router.get('/:id', getDepartmentById);

// تحديث قسم معين
router.put('/:id', updateDepartment);

// حذف قسم معين
router.delete('/:id', deleteDepartment);

module.exports = router;
