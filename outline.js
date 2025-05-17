/**
 * Outline generation API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');
const SupabaseService = require('./supabase');

// POST /api/outline
router.post('/', async (req, res) => {
  try {
    const { title, research, prompt, systemPrompt, apiKey } = req.body;
    
    if (!title || !research) {
      return res.status(400).json({ error: 'Title and research are required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const outlines = await openaiService.generateOutlines(title, research, prompt, systemPrompt);
    
    res.json({ outlines });
  } catch (error) {
    console.error('Error in outline generation endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
