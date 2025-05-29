import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from 'mongoose';
import cors from 'cors';

import decisionRoutes from './routes/decisionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';



console.log('JWT_SECRET is:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Правильні HTTP-роути
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', decisionRoutes);
app.use('/api/history', historyRoutes);

// Кореневий маршрут
app.get('/', (req, res) => {
  res.send('Decision Insight API is running...');
});

// MongoDB підключення
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
