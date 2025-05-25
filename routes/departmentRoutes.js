const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createDepartment,getDepartmentById,updateDepartment, deleteDepartment } = require('../controllers/departmentController');

router.post('/', protect, authorize(4), createDepartment);
router.get('/:id', protect, authorize(4), getDepartmentById);
router.put('/:id', protect, authorize(4), updateDepartment);
router.delete('/:id', protect, authorize(4), deleteDepartment);

module.exports = router;