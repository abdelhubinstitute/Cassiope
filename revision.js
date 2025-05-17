/**
 * Revision writing API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');
const SupabaseService = require('./supabase');

// POST /api/revision
router.post('/', async (req, res) => {
  try {
    const { title, research, outline, draft, critique, prompt, systemPrompt, apiKey } = req.body;
    
    if (!title || !research || !outline || !draft || !critique) {
      return res.status(400).json({ 
        error: 'Title, research, outline, draft, and critique are required' 
      });
    }
    
    const openaiService = new OpenAIService(apiKey);
    const revision = await openaiService.generateRevision(
      title, research, outline, draft, critique, prompt, systemPrompt
    );
    
    res.json({ revision });
  } catch (error) {
    console.error('Error in revision writing endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
