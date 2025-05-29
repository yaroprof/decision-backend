// backend/routes/messageRoutes.js

import express from 'express';
import Message from '../models/Message.js';
import authMiddleware from '../authMiddleware/authMiddleware.js';

const router = express.Router();

// GET /api/messages — отримати всі повідомлення користувача
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// POST /api/messages — зберегти нове повідомлення
router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Тут має бути логіка аналізу рішення — можеш вставити виклик GPT або свій алгоритм
    const aiResponse = `This is a sample analysis for: "${message}"`;

    const newMessage = await Message.create({
      userId: req.userId,
      userMessage: message,
      aiResponse,
    });

    res.json({ reply: aiResponse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

export default router;
