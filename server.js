 
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// استيراد الموديلات
 
require('./models/User');
require('./models/Department');
require('./models/Section');
require('./models/ExhibitorRequest');
require('./models/Product');
// استيراد العلاقات
//require('./models/index');  
require('./models');
// استيراد الراوتس
const departmentRoutes = require('./routes/departmentRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const exhibitorRoutes = require('./routes/exhibitorRoutes');
const departmentManagerRoutes = require('./routes/departmentManagerRoutes');

// ربط الراوتس
app.use('/departments', departmentRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/exhibitor', exhibitorRoutes);
app.use('/api/department-manager', departmentManagerRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect:', err.message);
});