import express from 'express';
import axios from 'axios'; // нова бібліотека для HTTP запитів
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import authMiddleware from '../authMiddleware/authMiddleware.js';


const router = express.Router();
dotenv.config();

// Перевірка наявності ключа
if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is missing in .env');
}


// GET-запит (наприклад, для перевірки статусу API)

router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// router.get('/', (req, res) => {
//   res.json({ message: 'API is working. Use POST to analyze decisions.' });
// });

// POST маршрут для аналізу рішень
router.post('/', authMiddleware, async (req, res) => {
  const { message: userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for analyzing decisions.' },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    // save in DB
    const newMessage = new Message({ userId: req.userId, userMessage, aiResponse });
    await newMessage.save();

    res.json({ reply: aiResponse });

  } catch (error) {
    console.error('Groq error:', error.response?.data || error.message);
    res.status(500).json({
      error: "Groq error",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
