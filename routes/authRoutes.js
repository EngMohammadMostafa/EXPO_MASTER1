const express = require('express');
const router = express.Router();

const { register, login} = 
require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password', authController.resetPassword);

module.exports = router;