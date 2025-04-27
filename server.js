const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Admin Routes ✅ أضفنا مسارات مدير المعرض
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes); // أي مسار يبدأ بـ /admin يحتاج صلاحيات مدير

// Start server and connect to DB
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to the database:', err.message);
});
