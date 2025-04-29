const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const departmentRoutes = require('./routes/departmentRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/departments', departmentRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes); 

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to the database:', err.message);
});
