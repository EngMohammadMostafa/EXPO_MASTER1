const express = require('express');
const router = express.Router();

const { register } = require('../controllers/authController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.post('/create-manager', verifyToken, authorize(4), register);

router.get('/dashboard', verifyToken, authorize(4), (req, res) => {
  res.status(200).json({ message: 'لوحة تحكم مدير المعرض' });
});

module.exports = router;
