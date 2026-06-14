const { GoogleGenAI } = require('@google/genai');

const apiKey = process.env.GEMINI_API_KEY;
const isPlaceholder = !apiKey || apiKey.includes('your_') || apiKey === 'change_this_to_a_strong_secret';

if (isPlaceholder) {
  console.warn('GEMINI_API_KEY is not set. AI generation will return a clear error until you set it in server/.env.');
}

const ai = isPlaceholder ? null : new GoogleGenAI({ apiKey });

async function generateContent(prompt) {
  if (isPlaceholder) {
    throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY to server/.env and restart the server.');
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
  });
  return response.text;
}

module.exports = { generateContent };
