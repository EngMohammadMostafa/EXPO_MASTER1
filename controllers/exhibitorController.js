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

    res.status(200).json({ message: "تم دفع المبلغ المبدئي بنجاح. الطلب قيد الموافقة." });
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
  const request = await ExhibitorRequest.findOne({ where: { userId } });

  if (!request || request.status !== 'approved')
    return res.status(400).json({ message: "طلبك لم يُقبل بعد أو غير موجود." });

  if (request.finalPaymentStatus === 'paid' && request.wingAssigned)
    return res.status(400).json({ message: "تم الدفع وتخصيص الجناح مسبقًا." });

  request.finalPaymentStatus = 'paid';
  const newSection = await Section.create({
    name: `جناح ${request.exhibitionName}`,
    departments_id: request.departmentId,
    exhibitor_id: userId,
  });
  request.wingAssigned = true;
  await request.save();

  await mailService.sendMail({
    to: req.user.email,
    subject: 'تم تخصيص جناحك!',
    text: `تم دفع الرسوم النهائية وتخصيص جناحك بنجاح. يمكنك الآن إضافة المنتجات داخل جناحك.`,
  });

  res.status(200).json({
    message: "تم الدفع وتخصيص الجناح بنجاح.",
    section: newSection,
  });
};



exports.addProducts = async (req, res) => {
  const { productName, description, price } = req.body;
  const exhibitorId = req.user.id;

  try {
    const request = await ExhibitorRequest.findOne({ where: { userId: exhibitorId } });

    if (
      !request ||
      request.status !== 'approved' ||
      request.finalPaymentStatus !== 'paid' ||
      !request.wingAssigned
    ) {
      return res.status(403).json({ message: "لا يمكنك إضافة المنتجات قبل الموافقة وتخصيص جناح." });
    }

    const newProduct = await Product.create({
      exhibitorId,
      productName,
      description,
      price
    });

    res.status(201).json({ message: "تم إضافة المنتج بنجاح", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
