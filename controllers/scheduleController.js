const Schedule = require('../models/Schedule');
const Section = require('../models/Section');

exports.createSchedule = async (req, res) => {
  const { departmentId, eventTitle, eventDate } = req.body;
  const exhibitorId = req.user.id;

  try {
    const section = await Section.findOne({
      where: { exhibitor_id: exhibitorId, departments_id: departmentId }
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

exports.getSchedulesByDepartment = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const schedules = await Schedule.findAll({
      where: { departmentId },
      include: ['section']
    });

    res.json({ schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
