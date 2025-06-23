const Ticket = require('../models/Ticket');

exports.buyTicket = async (req, res) => {
  try {
    const { departmentId } = req.body;
    const userId = req.user.id;

    // تحقق من وجود تذكرة مسبقة
    const existing = await Ticket.findOne({ where: { userId, departmentId } });
    if (existing) {
      return res.status(400).json({ message: "You already own a ticket for this department." });
    }

    const ticket = await Ticket.create({ userId, departmentId });
    res.status(201).json({ message: "Ticket purchased successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { departmentId } = req.params;

    const ticket = await Ticket.findOne({ where: { userId, departmentId } });
    if (!ticket) {
      return res.status(403).json({ message: "Access denied. You do not have a ticket for this department." });
    }

    res.status(200).json({ message: "Access granted.", ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
