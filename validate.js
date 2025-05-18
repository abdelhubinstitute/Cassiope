const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

function getOpenAIClient(apiKey) {
  let options = { apiKey };
  if (apiKey && apiKey.startsWith('sk-proj-')) {
    const match = apiKey.match(/^sk-proj-([a-zA-Z0-9]+)-/);
    if (match) {
      options.project = match[1];
    }
  }
  return new OpenAI(options);
}

// POST /api/validate
router.post('/', async (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ ok: false, error: 'API key required' });
  }
  try {
    const client = getOpenAIClient(apiKey);
    // A lightweight call: list models as an authentication check
    await client.models.list();
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router; 