// controllers/TicketController.js
const Ticket = require('../models/Ticket');
const { v4: uuidv4 } = require('uuid');

class TicketController {

  // إنشاء تذكرة جديدة (دفع وهمي)
  static async createTicket(req, res) {
    try {
      const userId = req.user.id; // افترض أنك تستخدم Middleware للتحقق من المستخدم
      const { departmentId } = req.body;

      if (!departmentId) {
        return res.status(400).json({ message: "Department ID is required" });
      }

      // إنشاء تذكرة مع حالة pending ورمز QR عشوائي
      const ticket = await Ticket.create({
        userId,
        departmentId,
        qrCode: uuidv4(),
        status: 'pending',
      });

      return res.status(201).json({
        message: "Ticket created, please confirm payment to activate.",
        ticketId: ticket.id,
        qrCode: ticket.qrCode,
        status: ticket.status,
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // تأكيد الدفع (وهمي) لتفعيل التذكرة
  static async confirmPayment(req, res) {
    try {
      const { ticketId } = req.body;

      if (!ticketId) {
        return res.status(400).json({ message: "Ticket ID is required" });
      }

      const ticket = await Ticket.findByPk(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      if (ticket.status === 'paid') {
        return res.status(400).json({ message: "Ticket already paid" });
      }

      ticket.status = 'paid';
      await ticket.save();

      return res.status(200).json({ message: "Payment confirmed, ticket activated.", ticket });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // قائمة التذاكر للمستخدم (اختياري)
  static async listTickets(req, res) {
    try {
      const userId = req.user.id;

      const tickets = await Ticket.findAll({ where: { userId } });

      return res.status(200).json({ tickets });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TicketController;
