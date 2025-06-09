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

// 6. عرض تقارير طلبات العارضين حسب القسم
exports.getExhibitorRequests = async (req, res) => {
  try {
    const departmentId = req.user.departmentId;

    const requests = await ExhibitorRequest.findAll({
      where: { departmentId },
      include: [{ model: User, attributes: ['fullName', 'email'] }],
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الطلبات' });
  }
};

// 7. قبول طلب عارض
exports.acceptExhibitorRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const request = await ExhibitorRequest.findByPk(requestId, {
      include: [{ model: User }],
    });

    if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });

    request.status = 'accepted';
    await request.save();

    // إرسال إيميل للعارض بقبول الطلب
    await mailService.sendMail({
      to: request.User.email,
      subject: 'تم قبول طلبك',
      text: 'تم قبول طلبك، الرجاء إكمال الدفعة النهائية لتثبيت الحجز.',
    });

    res.json({ message: 'تم قبول الطلب بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل قبول الطلب' });
  }
};

// 8. رفض طلب عارض
exports.rejectExhibitorRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { reason } = req.body;

    const request = await ExhibitorRequest.findByPk(requestId, {
      include: [{ model: User }],
    });

    if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });

    request.status = 'rejected';
    await request.save();

    // إرسال إيميل بالرفض
    await mailService.sendMail({
      to: request.User.email,
      subject: 'تم رفض طلبك',
      text: `نأسف، تم رفض طلبك. السبب: ${reason}`,
    });

    res.json({ message: 'تم رفض الطلب وإرسال السبب للعارض' });
  } catch (err) {
    res.status(500).json({ error: 'فشل رفض الطلب' });
  }
};
