const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { financialReport, analyticsReport, summaryReport } = require('../controllers/reportController');

// فقط المدير الأعلى (userType = 4)
router.get('/financial', protect, authorize(4), financialReport);
router.get('/analytics', protect, authorize(4), analyticsReport);
router.get('/summary', protect, authorize(4), summaryReport);

module.exports = router;