// ✅ عرض الأجنحة المرتبطة بقسم معين
const Section = require('../models/Section');
const Product = require('../models/Product');

exports.getSectionsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const sections = await Section.findAll({ where: { departmentId } });
    res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};