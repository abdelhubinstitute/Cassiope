/**
 * Research API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');

// POST /api/research
router.post('/', async (req, res) => {
  try {
    const { topics, systemPrompt, apiKey } = req.body;
    
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Topics array is required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const research = await openaiService.performWebResearch(topics, systemPrompt);
    
    res.json({ research });
  } catch (error) {
    console.error('Error in research endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
