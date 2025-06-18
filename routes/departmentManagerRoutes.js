const express = require('express');
const router = express.Router();
const departmentManagerController = require('../controllers/departmentManagerController');
const authMiddleware = require('../middleware/auth');

// ✅ حماية جميع الراوتات عبر التوكن
router.use(authMiddleware.verifyToken);

// ✅ إدارة الأجنحة
router.get('/sections', departmentManagerController.getSectionsByDepartment);
router.post('/sections', departmentManagerController.createSection);
router.put('/sections/:id', departmentManagerController.updateSection);
router.delete('/sections/:id', departmentManagerController.deleteSection);

// ✅ العارضين الذين أكملوا الدفع النهائي
router.get('/confirmed-exhibitors', departmentManagerController.getConfirmedExhibitors);

// ✅ إدارة طلبات العارضين
router.get('/requests', departmentManagerController.getExhibitorRequests);
router.put('/requests/accept/:id', departmentManagerController.acceptExhibitorRequest);
router.put('/requests/reject/:id', departmentManagerController.rejectExhibitorRequest);

module.exports = router;