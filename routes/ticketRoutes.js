// const express = require('express');
// const router = express.Router();
// const TicketController = require('../controllers/TicketController');
// const { verifyToken } = require('../middleware/authMiddleware'); // Middleware تحقق المستخدم

// // إنشاء تذكرة - الدفع وهمي (يحتاج تسجيل دخول)
// router.post('/purchase', verifyToken, TicketController.createTicket);

// // تأكيد الدفع (وهمي)
// router.post('/confirm-payment', verifyToken, TicketController.confirmPayment);

// // عرض تذاكر المستخدم
// router.get('/my-tickets', verifyToken, TicketController.listTickets);

// module.exports = router;

const { Ticket, User, Department } = require('../models'); // استورد موديلاتك حسب تنظيمك
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

exports.confirmPaymentAndSendQR = async (req, res) => {
  const { ticketId } = req.body;

  try {
    // إيجاد التذكرة مع المستخدم والقسم المرتبط
    const ticket = await Ticket.findByPk(ticketId, {
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Department, attributes: ['name'] },
      ],
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status === 'paid') {
      return res.status(400).json({ message: 'Ticket already paid' });
    }

    // تحديث حالة التذكرة
    ticket.status = 'paid';

    // تكوين بيانات الـ QR Code (يمكن تخصيص البيانات حسب الحاجة)
    const qrData = `TicketID:${ticket.id};UserEmail:${ticket.User.email};Department:${ticket.Department.name}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    // حفظ رمز الـ QR في التذكرة
    ticket.qrCode = qrCodeImage;
    await ticket.save();

    // إعداد خدمة الإيميل (تأكد من متغيرات البيئة EMAIL_USER, EMAIL_PASS)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // تكوين محتوى البريد الإلكتروني
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ticket.User.email,
      subject: `رمز الدخول الخاص بتذكرتك لقسم ${ticket.Department.name}`,
      html: `
        <h2>مرحباً ${ticket.User.name}</h2>
        <p>شكراً لك على شراء تذكرتك لقسم <b>${ticket.Department.name}</b>.</p>
        <p>فيما يلي رمز الدخول الخاص بك:</p>
        <img src="${qrCodeImage}" alt="QR Code" />
      `,
    };

    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions);

    return res.json({ message: 'تم تأكيد الدفع وإرسال رمز الدخول عبر البريد الإلكتروني.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تأكيد الدفع.' });
  }
};
