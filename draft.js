/**
 * Draft writing API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');
const SupabaseService = require('./supabase');

// POST /api/draft
router.post('/', async (req, res) => {
  try {
    const { title, research, outline, prompt, systemPrompt, apiKey } = req.body;
    
    if (!title || !research || !outline) {
      return res.status(400).json({ error: 'Title, research, and outline are required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const draft = await openaiService.generateDraft(title, research, outline, prompt, systemPrompt);
    
    res.json({ draft });
  } catch (error) {
    console.error('Error in draft writing endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
