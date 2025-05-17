/**
 * Title generation API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');

// POST /api/title
router.post('/', async (req, res) => {
  try {
    const { theme, prompt, systemPrompt, apiKey } = req.body;
    
    if (!theme) {
      return res.status(400).json({ error: 'Theme is required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const titles = await openaiService.generateTitles(theme, prompt, systemPrompt);
    
    res.json({ titles });
  } catch (error) {
    console.error('Error in title generation endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
