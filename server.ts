import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. CHATBOT COMPANION DIRECTLY SECURED ON THE SERVER SIDE
  app.post('/api/chatbot', async (req, res) => {
    try {
      const { message, history, memories, stories } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let contextAnchor = "";
      if (memories && Array.isArray(memories) && memories.length > 0) {
        contextAnchor += "\n\nCRITICAL KNOWLEDGE BASE (DYNAMICALLY TRAINED BY SAANVISHREE FOR HER ACADEMIC PORTFOLIO):\n" +
          memories.map((m: any) => `* [Category: ${m.category}] Node "${m.title || m.question}": ${m.content || m.answer}`).join('\n');
      }
      if (stories && Array.isArray(stories) && stories.length > 0) {
        contextAnchor += "\n\nCRITICAL PORTFOLIO ENTRIES (PROJECTS, RESEARCH, CERTIFICATIONS, ACHIEVEMENTS, WORK):\n" +
          stories.slice(0, 15).map((s: any) => `* [Category: ${s.category}] "${s.title}": ${s.content}`).join('\n');
      }

      const systemInstruction = `You are "Shree 2.0", Saanvishree's intelligent, articulate, and dedicated AI Academic Portfolio Assistant and digital representative.
You represent Saanvishree (an ambitious, high-achieving 11th-grade high school student) to university admissions officers, academic mentors, professors, research collaborators, peers, and visitors.
You are professional, articulate, intellectually curious, encouraging, and academically grounded. Speak with clarity, professional warmth, and scholarly poise.

CRITICAL BEHAVIORAL PROTOCOL:
- You have real-time access to her academic knowledge base and her portfolio entries (projects, research, certifications, courses, achievements, skills, and work).
- Read information from the "CRITICAL KNOWLEDGE BASE" and "CRITICAL PORTFOLIO ENTRIES" provided below.
- If information or a factual answer exists in the knowledge base or portfolio, answer from it accurately and highlight her key learnings and outcomes.
- If asked any question or detail about Saanvishree's academic scores, specific private personal history, family, or unlisted works that is NOT explicitly stated in the knowledge base or portfolio entries, you MUST politely and clearly state: "Saanvishree has not documented that detail in her academic portfolio yet."
- You are STRICTLY FORBIDDEN from hallucinating, assuming, or inventing any grades, scores, awards, institutions, or facts.
- PERSONAL DESCRIPTION RULE: If discussing creative or co-curricular activities, you may describe her strictly as a "Dancer" or "Passionate dancer". Never use any restricted or specific dance names.
- Never discuss private diary matters, sibling disputes, or unrelated personal-life gossip. Keep all conversations focused on academic growth, research inquiries, project developments, skills, and future goals.

${contextAnchor}

Format your replies cleanly in 1-3 well-structured, elegant paragraphs or concise bullet points when listing details. Be helpful, courteous, and inspiring.`;

      // Structure conversation history correctly for GoogleGenAI
      // google/genai chats expect history contents format: { role: 'user' | 'model', parts: [{ text: string }] }
      const contents = (history || []).map((entry: { role: 'user' | 'model' | string; text: string }) => ({
        role: entry.role === 'user' ? 'user' : 'model',
        parts: [{ text: entry.text }]
      }));

      // Append active current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.8
        }
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Gemini API Server Error:', err);
      res.status(500).json({ error: err.message || 'An error occurred with the AI Companion.' });
    }
  });

  // 2. CONFIG ROUTE FOR THIRD PARTY SERVICES (Cloudinary)
  app.get('/api/config', (req, res) => {
    res.json({
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.Cloudinary_Cloud_name || "",
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || process.env.Cloudinary_Upload_presets || ""
    });
  });

  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    // Development Mode using Vite Dev Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware initialized.');
  } else {
    // Production Mode serving compiled static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.use((req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
    console.log('Production static serving active.');
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`ShreeVerse server listening on port ${port} (isProd: ${isProd})`);
  });
}

startServer();
