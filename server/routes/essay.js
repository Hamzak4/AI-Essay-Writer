const express = require('express');
const auth = require('../middleware/auth');
const Essay = require('../models/Essay');
const { generateContent } = require('../controllers/gemini');

const router = express.Router();

router.post('/generate', auth, async (req, res) => {
  try {
    const { topic, tone, length, type } = req.body;

    const wordCount = length === 'short' ? 300 : length === 'medium' ? 600 : 1000;

    const prompt = `Write a ${tone || 'formal'} ${type || 'essay'} about "${topic}".
The essay should be approximately ${wordCount} words long.
Include a clear introduction, well-structured body paragraphs, and a conclusion.
Make it engaging, informative, and well-researched.
Use proper grammar and academic writing style.
Do not include any markdown formatting - just plain text with paragraphs.`;

    const content = await generateContent(prompt);

    const essay = new Essay({
      userId: req.user.id,
      title: `${type || 'Essay'}: ${topic}`,
      topic,
      content,
      tone: tone || 'formal',
      wordCount: content.split(/\s+/).length,
      type: type || 'essay'
    });
    await essay.save();

    res.json({ essay });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const essays = await Essay.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ essays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const essay = await Essay.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!essay) return res.status(404).json({ error: 'Essay not found' });
    res.json({ message: 'Essay deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
