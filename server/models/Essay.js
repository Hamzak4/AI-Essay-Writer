const mongoose = require('mongoose');

const essaySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
  tone: { type: String, default: 'formal' },
  wordCount: { type: Number },
  type: { type: String, default: 'essay' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Essay', essaySchema);
