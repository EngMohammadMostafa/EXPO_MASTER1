const ExhibitorRequest = require('../models/ExhibitorRequest');
const Product = require('../models/Product');
const Section = require('../models/Section');
const mailService = require('../utils/mailService');

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

    request.paymentStatus = 'final-paid';
    request.status = 'final-waiting-section';
    request.finalPaymentDate = new Date();
    await request.save();

    await mailService.sendMail({
      to: req.user.email,
      subject: 'تم استلام الدفعة النهائية',
      text: 'شكرًا لك، تم استلام دفعتك النهائية وسيتم تأكيد جناحك خلال 24 ساعة.',
    });

    res.json({ message: "تم دفع الدفعة النهائية بنجاح" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const userId = req.user.id;

  try {
    const section = await Section.findOne({ where: { exhibitor_id: userId } });
    if (!section) {
      return res.status(400).json({ message: 'ليس لديك جناح لإضافة المنتجات إليه' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      exhibitor_id: userId,
      section_id: section.id,
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
