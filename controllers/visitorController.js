const Section = require('../models/Section');
const Product = require('../models/Product');
const Ticket = require('../models/Ticket');

// ✅ عرض الأجنحة المرتبطة بقسم معين - بشرط وجود تذكرة
exports.getSectionsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const userId = req.user.id;

    // التحقق من أن المستخدم لديه تذكرة لهذا القسم
    const ticket = await Ticket.findOne({
      where: { userId, departmentId }
    });

    if (!ticket) {
      return res.status(403).json({
        message: "❌ لا تملك تذكرة لدخول هذا القسم"
      });
    }

    // استرجاع الأجنحة (sections) التابعة للقسم
    const sections = await Section.findAll({ where: { departmentId } });

    res.status(200).json({ sections });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ عرض المنتجات داخل جناح معين
exports.getProductsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const products = await Product.findAll({ where: { sectionId } });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};