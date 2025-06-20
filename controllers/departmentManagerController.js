const { Section, ExhibitorRequest, User, Department } = require('../models');
  const mailService = require('../utils/mailService');

  // 1. جلب كل الأجنحة في القسم الخاص بمدير القسم
  exports.getSectionsByDepartment = async (req, res) => {
    try {
      const departmentId = req.user.departmentId;
      const sections = await Section.findAll({ where: { departments_id: departmentId } });
      res.json(sections);
    } catch (err) {
      res.status(500).json({ error: 'حدث خطأ أثناء جلب الأجنحة' });
    }
  };

  // 2. حذف جناح
  exports.deleteSection = async (req, res) => {
    try {
      const sectionId = req.params.id;
      await Section.destroy({ where: { id: sectionId } });
      res.json({ message: 'تم حذف الجناح بنجاح' });
    } catch (err) {
      res.status(500).json({ error: 'فشل حذف الجناح' });
    }
  };

  // 3. تعديل جناح
  exports.updateSection = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Section.update({ name }, { where: { id } });
      res.json({ message: 'تم تعديل الجناح بنجاح' });
    } catch (err) {
      res.status(500).json({ error: 'فشل تعديل الجناح' });
    }
  };

  // ✅ 4. جلب العارضين الذين أكملوا الدفع النهائي
  exports.getConfirmedExhibitors = async (req, res) => {
    try {
      const departmentId = req.user.departmentId;

      const exhibitors = await User.findAll({
        where: {
          userType: 2,
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
  exports.createSection = async (req, res) => {
    try {
      const { exhibitor_id, name } = req.body;
      const departments_id = req.user.departmentId;
      const section = await Section.create({ name, exhibitor_id, departments_id });
      res.status(201).json({ message: 'تم إنشاء الجناح بنجاح', section });
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
        include: [{ model: User }]
      });

      if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });

      request.status = 'approved';
      await request.save();

      await mailService.sendMail({
        to: request.User.email,
        subject: 'تم قبول طلبك',
        text: 'تم قبول طلبك، الرجاء إكمال الدفعة النهائية لتثبيت الحجز.'
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

      await mailService.sendMail({
        to: request.User.email,
        subject: 'تم رفض طلبك',
        text:`   نأسف، تم رفض طلبك. السبب: ${reason}`,
      });

      res.json({ message: 'تم رفض الطلب وإرسال السبب للعارض' });
    } catch (err) {
      res.status(500).json({ error: 'فشل رفض الطلب' });
    }
  };
  // قبول طلب عارض
  exports.acceptExhibitorRequest = async (req, res) => {
    const request = await ExhibitorRequest.findByPk(req.params.id, { include: [{ model: User }] });
    if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });
    
    request.status = 'approved';
    await request.save();

    await mailService.sendMail({
      to: request.User.email,
      subject: 'تم قبول طلبك',
      text: 'لقد تم قبول طلبك. الرجاء الآن دفع الدفعة النهائية لاستكمال إجراءات تخصيص الجناح.',
    });

    res.json({ message: 'تم قبول الطلب وإرسال الإيميل.' });
  };

  // رفض طلب عارض
  exports.rejectExhibitorRequest = async (req, res) => {
    const { reason } = req.body;
    const request = await ExhibitorRequest.findByPk(req.params.id, { include: [{ model: User }] });
    if (!request) return res.status(404).json({ message: 'الطلب غير موجود' });

    request.status = 'rejected';
    request.rejectionReason = reason; // تأكد من إضافة الحقل في الموديل إذا لم يكن موجوداً
    await request.save();

    await mailService.sendMail({
      to: request.User.email,
      subject: 'تم رفض طلبك',
      text:`  نأسف، تم رفض طلبك. السبب: ${reason}`,
    });

    res.json({ message: 'تم رفض الطلب وإرسال سبب الرفض.' });
  };

  exports.filterRequestsByStatus = async (req, res) => {
    const departmentId = req.user.departmentId;
    const { status } = req.query; // 'approved' أو 'rejected' أو 'waiting-approval'

    try {
      const requests = await ExhibitorRequest.findAll({
        where: { departmentId, status },
        include: [{ model: User, attributes: ['fullName', 'email'] }],
      });

      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: 'حدث خطأ أثناء الفلترة' });
    }
  };

  exports.getEligibleExhibitorsForSection = async (req, res) => {
    const departmentId = req.user.departmentId;

    try {
      const eligible = await User.findAll({
        where: {
          userType: 2,
          departmentId,
          isPaymentConfirmed: true,
        },
        include: [{
          model: ExhibitorRequest,
          where: {
            status: 'final-waiting-section',
            paymentStatus: 'final-paid',
          }
        }],
        attributes: ['id', 'fullName', 'email']
      });

      res.json(eligible);
    } catch (err) {
      res.status(500).json({ error: 'حدث خطأ أثناء جلب العارضين المؤهلين' });
    }
  };


  exports.approveRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
      const request = await ExhibitorRequest.findByPk(requestId);
      if (!request) {
        return res.status(404).json({ message: "الطلب غير موجود" });
      }

      if (request.status === 'approved') {
        return res.status(400).json({ message: 'الطلب تمت الموافقة عليه مسبقًا' });
      }

      request.status = 'approved';
      await request.save();

      const user = await User.findByPk(request.userId);
      if (user) {
        await mailService.sendMail({
          to: user.email,
          subject: 'تمت الموافقة على طلبك',
          text: 'يمكنك الآن دفع الدفعة النهائية وإنشاء جناحك.',
        });
      }

      res.status(200).json({ message: 'تمت الموافقة على الطلب' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.rejectRequest = async (req, res) => {
    const { requestId } = req.params;
    const { reason } = req.body;

    try {
      const request = await ExhibitorRequest.findByPk(requestId);
      if (!request) {
        return res.status(404).json({ message: "الطلب غير موجود" });
      }

      request.status = 'rejected';
      request.rejectionReason = reason;
      await request.save();

      const user = await User.findByPk(request.userId);
      if (user) {
        await mailService.sendMail({
          to: user.email,
          subject: 'تم رفض طلبك',
          text:`  تم رفض طلبك للسبب التالي: ${reason}`,
        });
      }

      res.status(200).json({ message: 'تم رفض الطلب بنجاح' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  console.log("إنشاء جناح جديد للعارض:", req.body.exhibitor_id);
