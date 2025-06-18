const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  let { name, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // ✅ منع التلاعب: إذا كان من مسار إنشاء المدير، ثبّت نوع المستخدم = 3
    if (req.originalUrl.includes('/admin/create-manager')) {
      userType = 3;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType
    });

    if (userType === 3) {
      return res.status(201).json({
        message: "تم إنشاء مدير القسم بنجاح.",
        managerId: newUser.id
      });
    }

    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


 exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      message: "Login successful",
      token,
      userType: user.userType
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "البريد الإلكتروني غير مسجل" });

    res.status(200).json({
      message: "البريد الإلكتروني موجود ويمكن إعادة تعيين كلمة المرور",
      email: user.email  
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "البريد الإلكتروني غير مسجل" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "كلمتا المرور غير متطابقتين" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ميدل وير التحقق من التوكن وتحديد المستخدم
exports.verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token  !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// ✅ تفويض صلاحيات بناءً على userType
exports.authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ message: 'You do not have permission to access this route.' });
    }
    next();
  };
};

// ✅ تحقق خاص بالعارض فقط
exports.verifyExhibitor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user  user.userType !== 2) {
      return res.status(403).json({ message: "Access denied. Not an exhibitor." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};