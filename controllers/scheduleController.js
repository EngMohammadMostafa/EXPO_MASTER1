const Schedule = require('../models/Schedule');
const Section = require('../models/Section');

// إنشاء فعالية جديدة مرتبطة بالقسم والجناح
exports.createSchedule = async (req, res) => {
  const { departmentId, eventTitle, eventDate } = req.body;
  const exhibitorId = req.user.id;

  try {
    const section = await Section.findOne({
      where: {
        exhibitor_id: exhibitorId,
        departments_id: departmentId
      }
    });

    if (!section) {
      return res.status(403).json({ message: 'لا يمكنك إنشاء فعالية في هذا القسم' });
    }

    const schedule = await Schedule.create({
      departmentId,
      sectionId: section.id,
      eventTitle,
      eventDate
    });

    res.status(201).json({ message: 'تم إنشاء الفعالية بنجاح', schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب جميع الفعاليات المرتبطة بقسم معين
exports.getSchedulesByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const schedules = await Schedule.findAll({
      where: { departmentId },
      include: [{
        model: Section,
        as: 'section',
        attributes: ['id', 'name', 'exhibitor_id']
      }],
      order: [['eventDate', 'ASC']]
    });

    res.status(200).json({ schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
