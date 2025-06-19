const ExhibitorRequest = require('../models/ExhibitorRequest');
const Product = require('../models/Product');
const Section = require('../models/Section');
const mailService = require('../utils/mailService');
const Schedule = require('../models/Schedule');
const { id } = req.params;
const { eventTitle, eventDate } = req.body;
const exhibitorId = req.user.id;



exports.createRequest = async (req, res) => {
  const { exhibitionName, departmentId, contactPhone, notes } = req.body;
  const userId = req.user.id;

  try {
    const existing = await ExhibitorRequest.findOne({ 
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    if (existing && existing.status !== 'rejected') {
      return res.status(400).json({ message: "لديك طلب جاري بالفعل" });
    }

    const newRequest = await ExhibitorRequest.create({
      userId,
      exhibitionName,
      departmentId,
      contactPhone,
      notes
    });

    res.status(201).json({
      message: "تم إرسال الطلب بنجاح",
      request: newRequest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.payInitial = async (req, res) => {
  const userId = req.user.id;

  try {
    const request = await ExhibitorRequest.findOne({ where: { userId } });
    if (!request) {
      return res.status(404).json({ message: "لم يتم العثور على طلب للمستخدم" });
    }

    request.paymentStatus = 'paid';
    request.status = 'waiting-approval';
    await request.save();

    await mailService.sendMail({
      to: req.user.email,
      subject: 'تم دفع الدفعة الأولى',
      text: 'شكراً لك، نحن الآن نراجع طلبك، وسنقوم بإعلامك بعد الموافقة.',
    });

    res.status(200).json({ message: "تم دفع المبلغ الأولي بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.trackRequest = async (req, res) => {
  const userId = req.user.id;

  try {
    const request = await ExhibitorRequest.findOne({ where: { userId } });
    if (!request) {
      return res.status(404).json({ message: "لا يوجد طلب خاص بك" });
    }

    res.status(200).json({
      status: request.status,
      paymentStatus: request.paymentStatus,
      finalPaymentStatus: request.finalPaymentStatus,
      wingAssigned: request.wingAssigned,
      notes: request.notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.payFinal = async (req, res) => {
  const userId = req.user.id;

  try {
    const request = await ExhibitorRequest.findOne({ where: { userId } });
    if (!request) {
      return res.status(404).json({ message: "طلب العارض غير موجود" });
    }

    request.finalPaymentStatus = 'paid';
    request.status = 'waiting-approval';
    request.finalPaymentDate = new Date();

    // تحقق إذا لديه جناح مسبقًا
    const existingSection = await Section.findOne({ where: { exhibitor_id: userId } });

    if (!existingSection) {
      await Section.create({
        name:` جناح ${request.exhibitionName}`,
        departments_id: request.departmentId,
        exhibitor_id: userId,
      });

      request.wingAssigned = true; // إشارة أن لديه جناح الآن
    }

    await request.save();

    await mailService.sendMail({
      to: req.user.email,
      subject: 'تم استلام الدفعة النهائية',
      text: 'شكرًا لك، تم استلام دفعتك النهائية وسيتم تأكيد جناحك خلال 24 ساعة.',
    });

    res.json({ message: "تم دفع الدفعة النهائية وإنشاء الجناح بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.addProduct = async (req, res) => {
  const { productName, description, price, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const section = await Section.findOne({ where: { exhibitor_id: userId } });
    if (!section) {
      return res.status(400).json({ message: 'ليس لديك جناح لإضافة المنتجات إليه' });
    }

    const product = await Product.create({
     productName ,
     description,
     price,
     exhibitorId: userId,
     sectionId: section.id
    });

    res.status(201).json({ message: 'تم إضافة المنتج بنجاح', product });
  } catch (err) {
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة المنتج' });
  }
};
exports.getMyProducts = async (req, res) => {
    const exhibitorId = req.user.id;
  
    try {
      const products = await Product.findAll({ where: { exhibitor_id: exhibitorId } });
  
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.createWing = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const existing = await Section.findOne({ where: { exhibitor_id: userId } });
      if (existing) {
        return res.status(400).json({ message: 'لديك جناح بالفعل' });
      }
  
      const request = await ExhibitorRequest.findOne({ where: { userId } });
      if (!request || request.finalPaymentStatus !== 'paid') {
        return res.status(400).json({ message: 'لم يتم دفع الدفعة النهائية' });
      }
  
      const wing = await Section.create({
        name:` جناح ${request.exhibitionName}`,
        departments_id: request.departmentId,
        exhibitor_id: userId
      });
  
      request.wingAssigned = true;
      await request.save();
  
      res.status(201).json({ message: 'تم إنشاء الجناح بنجاح', wing });
    } catch (err) {
      res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الجناح' });
    }
  };
  exports.createSchedule = async (req, res) => {
    const { departmentId, eventTitle, eventDate } = req.body;
    const exhibitorId = req.user.id;
  
    try {
      // تحقق أن العارض يمتلك جناحاً في القسم المحدد
      const section = await Section.findOne({
        where: {
          exhibitor_id: exhibitorId,
          departments_id: departmentId
        }
      });
  
      if (!section) {
        return res.status(403).json({ message: 'لا يمكنك إنشاء فعالية في هذا القسم' });
      }
  
      const schedule = await Schedule.create({
        departmentId,
        eventTitle,
        eventDate
      });
  
      res.status(201).json({ message: 'تم إنشاء الفعالية بنجاح', schedule });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.updateSchedule = async (req, res) => {
    try {
        // نحصل على الفعالية
        const schedule = await Schedule.findByPk(id);
        if (!schedule) return res.status(404).json({ message: 'الفعالية غير موجودة' });
    
        // تحقق أن العارض يمتلك جناحاً في القسم المرتبط بالفعالية
        const section = await Section.findOne({
          where: {
            exhibitor_id: exhibitorId,
            departments_id: schedule.departmentId
          }
        });
    
        if (!section) {
          return res.status(403).json({ message: 'لا تملك صلاحية تعديل هذه الفعالية' });
        }
    
        schedule.eventTitle = eventTitle || schedule.eventTitle;
        schedule.eventDate = eventDate || schedule.eventDate;
    
        await schedule.save();
    
        res.json({ message: 'تم تعديل الفعالية بنجاح', schedule });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
    exports.deleteSchedule = async (req, res) => {
        try {
            const schedule = await Schedule.findByPk(id);
            if (!schedule) return res.status(404).json({ message: 'الفعالية غير موجودة' });
        
            const section = await Section.findOne({
              where: {
                exhibitor_id: exhibitorId,
                departments_id: schedule.departmentId
              }
            });
        
            if (!section) {
              return res.status(403).json({ message: 'لا تملك صلاحية حذف هذه الفعالية' });
            }
        
            await schedule.destroy();
        
            res.json({ message: 'تم حذف الفعالية بنجاح' });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        };
        exports.getMySchedules = async (req, res) => {
            try {
                const sections = await Section.findAll({ where: { exhibitor_id: exhibitorId } });
                const departmentIds = sections.map(sec => sec.departments_id);
            
                const schedules = await Schedule.findAll({
                  where: { departmentId: departmentIds }
                });
            
                res.json({ schedules });
              } catch (error) {
                res.status(500).json({ error: error.message });
              }
            };