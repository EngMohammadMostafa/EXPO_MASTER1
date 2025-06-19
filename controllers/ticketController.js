const db = require("../models");
const { TicketReservation, Payment, User, Department } = db;

exports.reserveTicketAndPay = async (req, res) => {
  try {
    const {
      user_id,
      department_id,
      payment_method,
      amount,
      payment_type // 'initial' or 'final'
    } = req.body;

    // تحقق من أن المستخدم والقسم موجودان
    const user = await User.findByPk(user_id);
    const department = await Department.findByPk(department_id);

    if (!user || !department) {
      return res.status(404).json({ message: "User or department not found." });
    }

    // إنشاء رمز QR وهمي (يمكن تغييره لتوليد حقيقي)
    const qrCode = `QR-${Date.now()}-${user_id}`;

    // إنشاء الحجز
    const ticket = await TicketReservation.create({
      user_id,
      department_id,
      qr_code: qrCode,
      payment_method,
    });

    // إنشاء الدفع
    const payment = await Payment.create({
      booking_request_id: ticket.id,
      amount,
      payment_type,
      payment_method,
      paid_at: new Date(),
      validated: true,
    });

    return res.status(201).json({
      message: "Ticket reserved and payment completed.",
      ticket,
      payment,
    });
  } catch (error) {
    console.error("Error in reserveTicketAndPay:", error);
    return res.status(500).json({ message: "Server error.", error });
  }
};
