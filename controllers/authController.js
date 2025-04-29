const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userType 
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      });

      res.status(200).json({
        message: "Login successful",
        token,
        userType: user.userType, 
      });
      
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
 