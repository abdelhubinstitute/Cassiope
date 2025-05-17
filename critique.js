/**
 * Critique generation API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');

// POST /api/critique
router.post('/', async (req, res) => {
  try {
    const { draft, userFeedback, prompt, systemPrompt, apiKey } = req.body;
    
    if (!draft || !userFeedback) {
      return res.status(400).json({ error: 'Draft and user feedback are required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const critiques = await openaiService.generateCritiques(draft, userFeedback, prompt, systemPrompt);
    
    res.json({ critiques });
  } catch (error) {
    console.error('Error in critique generation endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
