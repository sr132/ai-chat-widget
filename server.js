import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Initialize environment secrets
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Gemini SDK engine
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

// Serve up the website files from your public subfolder
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    // Map dialogue histories smoothly to structural frames
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
    });

    res.json({ reply: response.text });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to talk to Gemini' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
