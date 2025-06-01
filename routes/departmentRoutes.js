const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createDepartment,getDepartmentById,updateDepartment, deleteDepartment, getAllDepartments } = require('../controllers/departmentController');

router.get('/', protect, authorize(4), getAllDepartments);

router.post('/', protect, authorize(4), createDepartment);
router.get('/:id', protect, authorize(4), getDepartmentById);
router.put('/:id', protect, authorize(4), updateDepartment);
router.delete('/:id', protect, authorize(4), deleteDepartment);

module.exports = router;

//router.get('/', getAllDepartments); // بدون حماية
