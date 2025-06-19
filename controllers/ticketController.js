// // controllers/TicketController.js
// const Ticket = require('../models/Ticket');
// const { v4: uuidv4 } = require('uuid');

// class TicketController {

//   // إنشاء تذكرة جديدة (دفع وهمي)
//   static async createTicket(req, res) {
//     try {
//       const userId = req.user.id; // افترض أنك تستخدم Middleware للتحقق من المستخدم
//       const { departmentId } = req.body;

//       if (!departmentId) {
//         return res.status(400).json({ message: "Department ID is required" });
//       }

//       // إنشاء تذكرة مع حالة pending ورمز QR عشوائي
//       const ticket = await Ticket.create({
//         userId,
//         departmentId,
//         qrCode: uuidv4(),
//         status: 'pending',
//       });

//       return res.status(201).json({
//         message: "Ticket created, please confirm payment to activate.",
//         ticketId: ticket.id,
//         qrCode: ticket.qrCode,
//         status: ticket.status,
//       });

//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   // تأكيد الدفع (وهمي) لتفعيل التذكرة
//   static async confirmPayment(req, res) {
//     try {
//       const { ticketId } = req.body;

//       if (!ticketId) {
//         return res.status(400).json({ message: "Ticket ID is required" });
//       }

//       const ticket = await Ticket.findByPk(ticketId);
//       if (!ticket) {
//         return res.status(404).json({ message: "Ticket not found" });
//       }

//       if (ticket.status === 'paid') {
//         return res.status(400).json({ message: "Ticket already paid" });
//       }

//       ticket.status = 'paid';
//       await ticket.save();

//       return res.status(200).json({ message: "Payment confirmed, ticket activated.", ticket });

//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   }

//   // قائمة التذاكر للمستخدم (اختياري)
//   static async listTickets(req, res) {
//     try {
//       const userId = req.user.id;

//       const tickets = await Ticket.findAll({ where: { userId } });

//       return res.status(200).json({ tickets });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = TicketController;

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
