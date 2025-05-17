/**
 * Search topics generation API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');

// POST /api/topics
router.post('/', async (req, res) => {
  try {
    const { title, systemPrompt, apiKey } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const openaiService = new OpenAIService(apiKey);
    const topics = await openaiService.generateSearchTopics(title, systemPrompt);

    res.json({ topics });
  } catch (error) {
    console.error('Error generating search topics:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 