// استيراد نموذج المستخدم من قاعدة البيانات
const User = require('../models/User');
// استيراد مكتبة تشفير كلمات المرور
const bcrypt = require('bcryptjs');
// استيراد مكتبة التوكنات JWT
const jwt = require('jsonwebtoken');

// ✅ تسجيل مستخدم جديد
exports.register = async (req, res) => {
  let { name, email, password, userType } = req.body; // استخراج البيانات من الطلب

  try {
    // التحقق من وجود المستخدم مسبقاً عبر البريد الإلكتروني
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "البريد الإلكتروني موجود مسبقاً" });

    // تشفير كلمة المرور إذا كانت موجودة
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // إذا تم إنشاء المستخدم من خلال مسار إنشاء المدير، قم بتثبيت النوع إلى 3
    if (req.originalUrl.includes('/admin/create-manager')) {
      userType = 3;
    }

    // إنشاء المستخدم الجديد
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType
    });

    // إذا كان المستخدم مدير قسم، أرجع رد مخصص
    if (userType === 3) {
      return res.status(201).json({
        message: "تم إنشاء مدير القسم بنجاح.",
        managerId: newUser.id
      });
    }

    // رد عام للمستخدمين الآخرين
    res.status(201).json({ message: "تم تسجيل المستخدم بنجاح", user: newUser });

  } catch (err) {
    // معالجة الأخطاء
    res.status(500).json({ error: err.message });
  }
};

// ✅ تسجيل الدخول
exports.login = async (req, res) => {
  const { email, password } = req.body; // استخراج البريد وكلمة المرور

  try {
    // البحث عن المستخدم بواسطة البريد
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "المستخدم غير موجود" });

    // مقارنة كلمة المرور مع المخزنة
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "بيانات اعتماد غير صحيحة" });

    // توليد JWT يحتوي على id, email, userType
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // صلاحية التوكن يوم واحد
    );

    // الرد بالتوكن ونوع المستخدم
    res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      userType: user.userType
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ التحقق من البريد الإلكتروني قبل إعادة تعيين كلمة المرور
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "البريد الإلكتروني غير مسجل" });

    res.status(200).json({
      message: "البريد الإلكتروني موجود ويمكن إعادة تعيين كلمة المرور",
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ إعادة تعيين كلمة المرور
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "البريد الإلكتروني غير مسجل" });

    // التحقق من الطول الأدنى لكلمة المرور
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
    }

    // التحقق من التطابق بين كلمتي المرور
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "كلمتا المرور غير متطابقتين" });
    }

    // تشفير كلمة المرور الجديدة وتحديثها
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save(); // حفظ التغييرات في قاعدة البيانات

    res.status(200).json({ message: "تم تغيير كلمة المرور بنجاح" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ التحقق من التوكن المرسل في الهيدر
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization; // قراءة التوكن من الهيدر
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'تم الرفض. لم يتم توفير توكن.' });
  }

  try {
    const token = authHeader.split(' ')[1]; // استخراج التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // التحقق من صحة التوكن

    const user = await User.findByPk(decoded.id); // البحث عن المستخدم
    if (!user)
      return res.status(401).json({ message: 'المستخدم غير موجود.' });

    req.user = user; // حفظ المستخدم في الطلب
    next(); // الانتقال للخطوة التالية

  } catch (error) {
    res.status(401).json({ message: 'التوكن غير صالح أو منتهي الصلاحية.' });
  }
};

// ✅ تفويض صلاحية الوصول بناءً على نوع المستخدم
exports.authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية الوصول لهذا المسار.' });
    }
    next();
  };
};

// ✅ ميدل وير خاص للتحقق من أن المستخدم هو عارض (userType = 2)
exports.verifyExhibitor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // قراءة التوكن
    if (!token) {
      return res.status(401).json({ message: "تم الرفض. لم يتم توفير توكن." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // فك التوكن
    const user = await User.findByPk(decoded.id); // جلب المستخدم

    if (!user || user.userType !== 2) {
      return res.status(403).json({ message: "تم الرفض. ليس عارضاً." });
    }

    req.user = user; // حفظ المستخدم في الطلب
    next(); // الانتقال إلى الخطوة التالية
  } catch (err) {
    return res.status(400).json({ message: "توكن غير صالح." });
  }
};
