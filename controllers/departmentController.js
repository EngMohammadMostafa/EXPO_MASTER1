// استيراد نموذج القسم من قاعدة البيانات
const Department = require('../models/Department');

// ✅ إنشاء قسم جديد
exports.createDepartment = async (req, res) => {
  try {
    const { name, startDate, endDate, manager_id, description } = req.body; // استخراج بيانات القسم من الطلب

    // التحقق من الحقول الإلزامية
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: "الرجاء ملء الحقول المطلوبة: الاسم، تاريخ البداية، وتاريخ النهاية." });
    }

    // إنشاء القسم في قاعدة البيانات
    const department = await Department.create({
      name,
      startDate,
      endDate,
      manager_id,
      description,
    });

    // إرجاع القسم الذي تم إنشاؤه
    res.status(201).json({ message: "تم إنشاء القسم بنجاح", department });
  } catch (error) {
    res.status(500).json({ error: error.message }); // معالجة الخطأ
  }
};

// ✅ تعديل بيانات قسم موجود
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params; // الحصول على معرف القسم من الرابط
    const { name, startDate, endDate, manager_id, description } = req.body;

    const department = await Department.findByPk(id); // البحث عن القسم
    if (!department)
      return res.status(404).json({ message: "القسم غير موجود" });

    // التحقق من الحقول الإلزامية
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: "الرجاء ملء الحقول المطلوبة: الاسم، تاريخ البداية، وتاريخ النهاية." });
    }

    // تحديث بيانات القسم
    await department.update({ name, startDate, endDate, manager_id, description });

    // إرجاع القسم بعد التحديث
    res.status(200).json({ message: "تم تحديث القسم بنجاح", department });
  } catch (error) {
    res.status(500).json({ error: error.message }); // معالجة الخطأ
  }
};

// ✅ جلب قسم واحد عبر معرفه
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params; // الحصول على المعرف من الرابط

    const department = await Department.findByPk(id); // البحث عن القسم
    if (!department)
      return res.status(404).json({ message: "القسم غير موجود" });

    res.status(200).json({ department }); // إرجاع القسم
  } catch (error) {
    res.status(500).json({ error: error.message }); // معالجة الخطأ
  }
};

// ✅ حذف قسم بناءً على المعرف
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id); // التحقق من وجود القسم
    if (!department)
      return res.status(404).json({ message: "القسم غير موجود" });

    await department.destroy(); // حذف القسم

    res.status(200).json({ message: "تم حذف القسم بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message }); // معالجة الخطأ
  }
};

// ✅ جلب جميع الأقسام
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll(); // جلب جميع الأقسام

    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: error.message }); // معالجة الخطأ
  }
};
