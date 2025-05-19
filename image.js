/**
 * Image generation API endpoint
 */

const express = require('express');
const router = express.Router();
const OpenAIService = require('./openai');
const axios = require('axios');

async function generateImageWithFal(prompt, falKey, openaiKey) {
  const url = 'https://queue.fal.run/fal-ai/gpt-image-1/text-to-image/byok';
  const body = {
    prompt,
    image_size: 'auto',
    num_images: 1,
    quality: 'high',
    background: 'auto',
    openai_api_key: openaiKey || ''
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Key ${falKey}`
  };

  // Submit generation request to fal queue
  const submitResp = await axios.post(url, body, { headers });

  // Fast-path: some models might return images synchronously
  if (submitResp.data?.images?.length) {
    return submitResp.data.images[0].url;
  }

  // For queued jobs we need to poll the status endpoint
  const { status_url: statusUrl, response_url: responseUrl, request_id: requestId } = submitResp.data;
  if (!statusUrl || !responseUrl || !requestId) {
    throw new Error('Fal image generation failed to enqueue');
  }

  // Poll for completion (max 60s)
  const maxAttempts = 60;
  const delayMs = 2000; // 2s between polls
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((res) => setTimeout(res, delayMs));

    const statusResp = await axios.get(statusUrl, { headers });
    const { status } = statusResp.data;
    if (status === 'COMPLETED') {
      const resultResp = await axios.get(responseUrl, { headers });
      if (resultResp.data?.images?.length) {
        return resultResp.data.images[0].url;
      }
      break;
    }
    if (status === 'FAILED' || status === 'CANCELED' || status === 'ERROR') {
      throw new Error(`Fal image generation ${status.toLowerCase()}`);
    }
  }

  throw new Error('Fal image generation timed out');
}

// POST /api/image
router.post('/', async (req, res) => {
  try {
    const { article, prompt, systemPrompt, apiKey, falKey } = req.body;
    
    if (!article) {
      return res.status(400).json({ error: 'Article content is required' });
    }
    
    const openaiService = new OpenAIService(apiKey);
    
    // First, generate the image prompt if not provided
    const imagePrompt = prompt || await openaiService.generateImagePrompt(article, prompt, systemPrompt);
    
    let imageUrl;
    if (falKey) {
      imageUrl = await generateImageWithFal(imagePrompt, falKey, apiKey);
    } else {
      imageUrl = await openaiService.generateImage(imagePrompt);
    }
    
    res.json({
      imageUrl,
      imagePrompt
    });
  } catch (error) {
    console.error('Error in image generation endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
