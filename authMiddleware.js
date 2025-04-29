// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ميدل وير لفك التوكن والتحقق من الصلاحية
exports.protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = user; // حفظ بيانات المستخدم في الريكويست
    next(); // تابع للمسارs
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// صلاحيات بناءً على نوع المستخدم
exports.authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ message: 'You do not have permission to access this route.' });
    }
    next();
  };
};