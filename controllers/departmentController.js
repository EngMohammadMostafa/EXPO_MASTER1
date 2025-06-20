const Department = require('../models/Department');

exports.createDepartment = async (req, res) => {
  try {
    const { name, startDate, endDate, manager_id, description } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: "الرجاء ملء الحقول المطلوبة: الاسم، تاريخ البداية، وتاريخ النهاية." });
    }

    const department = await Department.create({
      name,
      startDate,
      endDate,
      manager_id,
      description,
    });

    res.status(201).json({ message: "تم إنشاء القسم بنجاح", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, manager_id, description } = req.body;

    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "القسم غير موجود" });

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: "الرجاء ملء الحقول المطلوبة: الاسم، تاريخ البداية، وتاريخ النهاية." });
    }

    await department.update({ name, startDate, endDate, manager_id, description });

    res.status(200).json({ message: "تم تحديث القسم بنجاح", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "القسم غير موجود" });

    res.status(200).json({ department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "القسم غير موجود" });

    await department.destroy();

    res.status(200).json({ message: "تم حذف القسم بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();

    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
