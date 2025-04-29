const Department = require('../models/Department');

// إنشاء قسم جديد
exports.createDepartment = async (req, res) => {
  try {
    const { name, startDate, endDate, manager_id, description } = req.body;

    const department = await Department.create({
      name,
      startDate,
      endDate,
      manager_id,
      description,
    });

    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تعديل بيانات قسم
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, manager_id, description } = req.body;

    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    await department.update({ name, startDate, endDate, manager_id, description });

    res.status(200).json({ message: "Department updated successfully", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف قسم
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) return res.status(404).json({ message: "Department not found" });

    await department.destroy();

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};