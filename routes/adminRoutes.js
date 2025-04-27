const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// هذا مسار فقط مدير المعرض (userType = 4) بيقدر يشوفه
router.get('/dashboard', protect, authorize(4), (req, res) => {
  res.status(200).json({ message: 'لوحة تحكم مدير المعرض' });
});

module.exports = router;
