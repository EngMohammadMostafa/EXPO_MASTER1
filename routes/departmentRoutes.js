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

// ✅ حماية جميع المسارات والتأكد من أن المستخدم مدير مدينة (userType = 4)
router.use(verifyToken);
router.use(authorize(4));

router.get('/', getAllDepartments);
router.post('/', createDepartment);
router.get('/:id', getDepartmentById);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;