import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    userMessage: {
        type: String,
        required: [true, 'User message is required'],
        minLength: [2, 'User message must be at least 2 characters long'],
        maxLength: [1000, 'User message must be at most 500 characters long'],
        trim: true,
    },
    aiResponse: {
        type: String,
        required: [true, 'AI response is required'],
        minLength: [1, 'AI response must be at least 1 character long'],
        maxLength: [3000, 'AI response must be at most 300 characters long'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    
})

export default mongoose.model('Message', messageSchema)