import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const User = require('../models/User');


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = new User({ username, password: hashedPassword });
    await user.save();


    const token = generateToken(user._id);

    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};


exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};
