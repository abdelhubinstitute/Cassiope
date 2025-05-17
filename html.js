/**
 * HTML formatting API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');

// POST /api/html
router.post('/', async (req, res) => {
  try {
    const { article, imageUrl, prompt, systemPrompt, apiKey } = req.body;
    
    if (!article) {
      return res.status(400).json({ error: 'Article content is required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const html = await openaiService.formatHTML(article, imageUrl, prompt, systemPrompt);
    
    res.json({ html });
  } catch (error) {
    console.error('Error in HTML formatting endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
