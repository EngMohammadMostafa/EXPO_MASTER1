const ExhibitorRequest = require('../models/ExhibitorRequest');
const Product = require('../models/Product');
const Section = require('../models/Section');
const mailService = require('../utils/mailService');
const Department = require('../models/Department');


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
      notes,
      status: 'waiting-approval', // القيمة الافتراضية صراحة هنا حسب الجدول
      paymentStatus: 'unpaid',
      finalPaymentStatus: 'unpaid',
      wingAssigned: false,
      finalPaymentDate: new Date() // مطلوب في الجدول و NOT NULL
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

    const existingSection = await Section.findOne({ where: { exhibitor_id: userId } });

    if (!existingSection) {
      await Section.create({
        name:` جناح ${request.exhibitionName}`,
        departments_id: request.departmentId,
        exhibitor_id: userId,
      });

      request.wingAssigned = true;
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
      productName,
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
    const products = await Product.findAll({ where: { exhibitorId } });

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

exports.getDepartmentsForExhibitor = async (req, res) => {
  try {
    const departments = await Department.findAll({
      attributes: ['id', 'name', 'description', 'startDate', 'endDate']
    });
    res.status(200).json({ departments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};