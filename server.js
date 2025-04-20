const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Start server and connect to DB
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
