import express from 'express';
import Message from '../models/Message.js';
import authMiddleware from '../authMiddleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
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
