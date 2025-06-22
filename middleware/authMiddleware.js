const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Middleware للتحقق من التوكن وتحديد المستخدم في req.user
exports.verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

console.log("Token verification middleware is running...");

// ✅ Middleware لتفويض صلاحيات بناءً على userType
exports.authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ message: 'You do not have permission to access this route.' });
    }
    next();
  };
};

// ✅ Middleware للتحقق من أن المستخدم هو عارض فقط (userType = 2)
exports.verifyExhibitor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.userType !== 2) {
      return res.status(403).json({ message: 'Access denied. Not an exhibitor.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};
