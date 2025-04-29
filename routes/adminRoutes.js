const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

 router.get('/dashboard', protect, authorize(4), (req, res) => {
  res.status(200).json({ message: 'لوحة تحكم مدير المعرض' });
});

module.exports = router;