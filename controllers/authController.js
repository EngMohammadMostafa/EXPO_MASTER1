const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//                                   register 

exports.register = async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType // نمرر النوع
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) return res.status(400).json({ message: "Email already exists" });

//     const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({ message: "User registered successfully", user: newUser });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


//                                    log in   

exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // تحقق من كلمة المرور
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      // إنشاء JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      });
  
     // res.status(200).json({ message: "Login successful", token });

      res.status(200).json({
        message: "Login successful",
        token,
        userType: user.userType, // حتى نتحكم بالفرونت
      });
      
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

//                            forgot password 

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "Email not found" });
  
      // إنشاء رمز موقت أو رابط استرجاع (وهمي في هذه النسخة)
      const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15m"
      });
  
      // في الواقع ترسل هذا الرابط بالإيميل
      const resetLink = `https://yourdomain.com/reset-password?token=${resetToken}`;
  
      res.status(200).json({
        message: "Password reset link has been sent",
        resetLink // فقط للعرض، في الواقع لا ترسله للعميل مباشرة
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
 //                              reset password 

  exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      // تحقق من صحة التوكن
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // البحث عن المستخدم
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // تشفير كلمة المرور الجديدة
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // تحديث كلمة المرور
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: "Password has been reset successfully." });
    } catch (err) {
      res.status(400).json({ error: "Invalid or expired token" });
    }
  };
  