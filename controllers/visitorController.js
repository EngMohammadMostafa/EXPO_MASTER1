const { Section, Product, Ticket, User } = require('../models');
const { generateTicket } = require('../utils/ticketGenerator');

// ✅ عرض الأجنحة الخاصة بقسم معيّن (بعد التحقق من التذكرة)
exports.getSectionsByDepartment = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const ticket = await Ticket.findOne({
      where: {
        userId: req.user.id,
        departmentId: departmentId
      }
    });

    if (!ticket) {
      return res.status(403).json({ message: "⚠️ لا تملك تذكرة لهذا القسم." });
    }

    const sections = await Section.findAll({ where: { departmentId } });
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ عرض المنتجات داخل جناح معيّن
exports.getProductsBySection = async (req, res) => {
  try {
    const sectionId = req.params.sectionId;
    const products = await Product.findAll({ where: { sectionId } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ شراء التذكرة وتوليدها PDF
exports.buyTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { departmentId } = req.body;

    const existingTicket = await Ticket.findOne({ where: { userId, departmentId } });
    if (existingTicket) {
      return res.status(400).json({ message: "🔔 لديك تذكرة بالفعل لهذا القسم." });
    }

    const ticket = await Ticket.create({ userId, departmentId });

    const user = await User.findByPk(userId);
    await generateTicket(user);

    res.status(201).json({ message: "✅ تم شراء التذكرة بنجاح.", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ التحقق من وجود تذكرة
exports.checkTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const { departmentId } = req.params;

    const ticket = await Ticket.findOne({ where: { userId, departmentId } });

    res.status(200).json({ hasTicket: !!ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const Section = require('../models/Section');
// const Product = require('../models/Product');
// const Ticket = require('../models/Ticket');

// // ✅ عرض الأجنحة المرتبطة بقسم معين - بشرط وجود تذكرة
// exports.getSectionsByDepartment = async (req, res) => {
//   try {
//     const { departmentId } = req.params;
//     const userId = req.user.id;

//     // التحقق من أن المستخدم لديه تذكرة لهذا القسم
//     const ticket = await Ticket.findOne({
//       where: { userId, departmentId }
//     });

//     if (!ticket) {
//       return res.status(403).json({
//         message: "❌ لا تملك تذكرة لدخول هذا القسم"
//       });
//     }

//     // استرجاع الأجنحة (sections) التابعة للقسم
//     const sections = await Section.findAll({ where: { departmentId } });

//     res.status(200).json({ sections });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ عرض المنتجات داخل جناح معين
// exports.getProductsBySection = async (req, res) => {
//   try {
//     const { sectionId } = req.params;
//     const products = await Product.findAll({ where: { sectionId } });
//     res.status(200).json({ products });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
