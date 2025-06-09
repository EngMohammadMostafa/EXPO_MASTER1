const { Booth, ExhibitorRequest, User, Department } = require('../models');
const mailService = require('../utils/mailService');

// 1. جلب كل الأجنحة في القسم الخاص بمدير القسم
exports.getBoothsByDepartment = async (req, res) => {
  try {
    const departmentId = req.user.departmentId;

    const booths = await Booth.findAll({ where: { departmentId } });

    res.json(booths);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الأجنحة' });
  }
};
