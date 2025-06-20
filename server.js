const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const scheduleRoutes = require('./routes/scheduleRoutes');

app.use('/api/schedules', scheduleRoutes);

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// استيراد الموديلات (حتى يتم تعريفها)
require('./models/User');
require('./models/ExhibitorRequest');
require('./models/Department');
require('./models/Section');

// استيراد العلاقات
require('./models/associations');

// استيراد الراوتس
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const exhibitorRoutes = require('./routes/exhibitorRoutes');

app.use('/departments', departmentRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/exhibitor', exhibitorRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to the database:', err.message);
});