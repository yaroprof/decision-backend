import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const ensureJwtSecret = (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server configuration error: JWT_SECRET is missing' });
  }
  next();
};

router.post('/register', ensureJwtSecret, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
      message: 'User registered successfully',
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

router.post('/login', ensureJwtSecret, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, email: user.email },
      message: 'Login successful',
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

export default router;