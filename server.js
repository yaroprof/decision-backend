import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from 'mongoose';
import cors from 'cors';

import decisionRoutes from './routes/decisionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import messageRoutes from './routes/messageRoutes.js';



const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://decision-frontend-gamma.vercel.app'];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', decisionRoutes);
app.use('/api/history', historyRoutes);


app.get('/', (req, res) => {
  res.send('Decision Insight API is running...');
});

 mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
