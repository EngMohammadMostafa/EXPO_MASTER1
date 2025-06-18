const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getAllDepartments,
} = require('../controllers/departmentController');

// ✅ الحماية والتفويض لمدير المدينة فقط
router.use(protect);           // Middleware لحماية جميع الروابط التالية
router.use(authorize(4));      // Middleware يسمح فقط لمدير المدينة (userType = 4)

router.get('/', getAllDepartments);
router.post('/', createDepartment);
router.get('/:id', getDepartmentById);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
