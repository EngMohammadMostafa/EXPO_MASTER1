// controllers/exhibitorController.js
const ExhibitorRequest = require('../models/ExhibitorRequest');

exports.createRequest = async (req, res) => {
  const { exhibitionName, departmentId, contactPhone, notes } = req.body;
  const userId = req.user.id; // مأخوذ من verifyExhibitor middleware

  try {
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

    if (!request || request.status !== 'approved') {
      return res.status(400).json({ message: "طلبك لم يُقبل بعد أو غير موجود" });
    }

    request.finalPaymentStatus = 'paid';
    await request.save();

    res.status(200).json({ message: "تم دفع الدفعة النهائية بنجاح. سيتم تخصيص الجناح خلال 24 ساعة." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
