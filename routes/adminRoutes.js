// const express = require('express');
// const router = express.Router();

// const { register } = require('../controllers/authController');
// const { protect, authorize } = require('../middleware/authMiddleware');

//  router.post('/create-manager', protect, authorize(4), register);

// router.get('/dashboard', protect, authorize(4), (req, res) => {
//   res.status(200).json({ message: 'لوحة تحكم مدير المعرض' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();

const { register } = require('../controllers/authController');
// استيراد verifyToken و authorize بالاسم الصحيح
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.post('/create-manager', verifyToken, authorize(4), register);

router.get('/dashboard', verifyToken, authorize(4), (req, res) => {
  res.status(200).json({ message: 'لوحة تحكم مدير المعرض' });
});

module.exports = router;
