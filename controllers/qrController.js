const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Department = require('../models/Department');
const { sendMail } = require('../utils/mailService');

exports.sendQRToUser = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // العثور على التذكرة والتأكد من أنها مدفوعة
    const ticket = await Ticket.findById(ticketId).populate('userId departmentId');
    if (!ticket) return res.status(404).json({ message: 'التذكرة غير موجودة' });

    if (ticket.status !== 'paid') {
      return res.status(400).json({ message: 'لا يمكن إرسال QR قبل الدفع' });
    }

    const user = ticket.userId;
    const department = ticket.departmentId;

    // محتوى البريد
    const subject = `تذكرتك لدخول قسم ${department.name}`;
    const text = `مرحباً ${user.username},\n\nشكرًا لشرائك تذكرة دخول قسم ${department.name}.\n\nرمز الدخول الخاص بك هو: ${ticket.qr}\n\nيرجى استخدام هذا الرمز عند الوصول إلى القسم.`;

    const html = `
      <h3>مرحباً ${user.username}</h3>
      <p>شكرًا لشرائك تذكرة دخول قسم <strong>${department.name}</strong>.</p>
      <p><strong>رمز الدخول (QR):</strong> ${ticket.qr}</p>
      <p>يرجى استخدام هذا الرمز عند الوصول إلى القسم.</p>
    `;

    await sendMail({
      to: user.email,
      subject,
      text,
      html,
    });

    res.status(200).json({ message: 'تم إرسال QR إلى البريد الإلكتروني بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء إرسال البريد الإلكتروني' });
  }
};
