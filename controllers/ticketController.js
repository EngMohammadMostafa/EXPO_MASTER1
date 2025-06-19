const db = require("../models");
const qrcode = require("qrcode");

const TicketReservation = db.ticket_reservation;
const Payment = db.payment;
const Department = db.departments;

exports.buyTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { departmentId, paymentMethod } = req.body;

    // تحقق إذا القسم موجود
    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({ message: "القسم غير موجود" });
    }

    // تحقق إذا اشترى مسبقًا
    const existing = await TicketReservation.findOne({
      where: { user_id: userId, department_id: departmentId }
    });

    if (existing) {
      return res.status(400).json({ message: "لقد اشتريت تذكرة لهذا القسم مسبقًا" });
    }

    // توليد QR code
    const qrContent = `${userId}-${departmentId}-${Date.now()}`;
    const qrImage = await qrcode.toDataURL(qrContent);

    // إنشاء تذكرة
    const ticket = await TicketReservation.create({
      user_id: userId,
      department_id: departmentId,
      qr_code: qrImage,
      payment_method: paymentMethod
    });

    // تسجيل الدفع
    await Payment.create({
      booking_request_id: ticket.id, // نفترض أن booking_request_id يشير إلى التذكرة
      amount: 10.0, // ثابت أو ديناميكي حسب القسم
      payment_type: 'initial',
      payment_method: paymentMethod,
      paid_at: new Date(),
      validated: 1
    });

    // استجابة
    res.status(201).json({
      message: "تم شراء التذكرة بنجاح",
      ticket
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "حدث خطأ أثناء شراء التذكرة" });
  }
};
