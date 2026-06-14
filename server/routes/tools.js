const express = require('express');
const auth = require('../middleware/auth');
const { generateContent } = require('../controllers/gemini');

const router = express.Router();

router.post('/paraphrase', auth, async (req, res) => {
  try {
    const { text, style } = req.body;
    const prompt = `Paraphrase the following text in a ${style || 'standard'} style. Keep the meaning intact but change the wording significantly. Only return the paraphrased text, no explanations:\n\n"${text}"`;
    const result = await generateContent(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/grammar-check', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Check the following text for grammar, spelling, and punctuation errors. Return a JSON object with two fields: "corrected" (the corrected text) and "errors" (an array of objects with "original", "correction", and "explanation" fields). Only return valid JSON, no markdown:\n\n"${text}"`;
    const result = await generateContent(prompt);
    try {
      const parsed = JSON.parse(result);
      res.json(parsed);
    } catch {
      res.json({ corrected: result, errors: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/summarize', auth, async (req, res) => {
  try {
    const { text, length } = req.body;
    const prompt = `Summarize the following text in ${length || 'a few sentences'}. Be concise and capture the key points. Only return the summary:\n\n"${text}"`;
    const result = await generateContent(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/citation', auth, async (req, res) => {
  try {
    const { topic, style } = req.body;
    const prompt = `Generate 5 realistic academic citations related to "${topic}" in ${style || 'APA'} format. These should look like real academic sources with proper formatting. Return only the citations, one per line.`;
    const result = await generateContent(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/outline', auth, async (req, res) => {
  try {
    const { topic, type } = req.body;
    const prompt = `Create a detailed outline for a ${type || 'research'} essay about "${topic}". Include main headings and subpoints. Format with clear hierarchy using numbers and letters. Only return the outline.`;
    const result = await generateContent(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/title-generator', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = `Generate 10 creative and engaging essay titles about "${topic}". Mix academic and creative styles. Return only the titles, one per line, numbered.`;
    const result = await generateContent(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
