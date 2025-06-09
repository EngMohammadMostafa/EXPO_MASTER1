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

// 2. حذف جناح
exports.deleteBooth = async (req, res) => {
  try {
    const boothId = req.params.id;

    await Booth.destroy({ where: { id: boothId } });

    res.json({ message: 'تم حذف الجناح بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل حذف الجناح' });
  }
};

// 3. تعديل جناح
exports.updateBooth = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    await Booth.update({ name, location }, { where: { id } });

    res.json({ message: 'تم تعديل الجناح بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل تعديل الجناح' });
  }
};

// 4. جلب العارضين الذين أكملوا الدفع النهائي
exports.getConfirmedExhibitors = async (req, res) => {
  try {
    const departmentId = req.user.departmentId;

    const exhibitors = await User.findAll({
      where: {
        userType: 2, // العارضين
        departmentId,
        isPaymentConfirmed: true,
      },
      attributes: ['id', 'fullName', 'email'],
    });

    res.json(exhibitors);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء جلب العارضين' });
  }
};

// 5. إنشاء جناح جديد لعارض
exports.createBooth = async (req, res) => {
  try {
    const { exhibitorId, name, location } = req.body;
    const departmentId = req.user.departmentId;

    const booth = await Booth.create({ name, location, exhibitorId, departmentId });

    res.status(201).json({ message: 'تم إنشاء الجناح بنجاح', booth });
  } catch (err) {
    res.status(500).json({ error: 'فشل في إنشاء الجناح' });
  }
};
