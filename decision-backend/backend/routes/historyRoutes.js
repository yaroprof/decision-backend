import express from 'express';
import dotenv from 'dotenv';
import Message from '../models/Message.js';
import authMiddleware from '../authMiddleware/authMiddleware.js';

const router = express.Router();
dotenv.config();

// Post new message
router.post('/', async (req, res) => {
    const { userMessage, aiResponse } = req.body;

    if (!userMessage || !aiResponse) {
        return res.status(400).json({ error: 'Both userMessage and aiResponse are required' })
    }
    try{
        const newMessage = new Message({ userMessage, aiResponse });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    }catch (error){
        res.status(500).json({ error: 'Failed to save message', details: error.message })
    }
})


// GET all history
router.get('/',authMiddleware, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history', details: error.message });
    }
});

// get message by id
router.get('/:id', async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ error: "Message not found" });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch message', details: error.message });
    }
})

// Delete a message
router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Delete successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message', details: error.message })
    }
})

export default router;