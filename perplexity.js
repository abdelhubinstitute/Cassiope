/**
 * Perplexity API service for research
 */

const axios = require('axios');
const { PERPLEXITY_API_KEY } = require('./env');

class PerplexityService {
  constructor(apiKey = PERPLEXITY_API_KEY) {
    this.apiKey = apiKey || PERPLEXITY_API_KEY;
    this.baseUrl = 'https://api.perplexity.ai/chat/completions';
  }

  /**
   * Perform research based on a title
   * @param {string} title - The selected title
   * @param {string} prompt - Custom prompt for research
   * @param {string} systemPrompt - Custom system prompt for research
   * @returns {Promise<string>} - Research results
   */
  async performResearch(title, prompt, systemPrompt) {
    const defaultPrompt = `Perform comprehensive research on the topic: "${title}".
    
    Please include:
    1. Key facts and statistics
    2. Historical context and background
    3. Current trends and developments
    4. Different perspectives and viewpoints
    5. Expert opinions and relevant quotes
    6. Potential controversies or debates
    7. Future implications or predictions
    
    Organize the information in a clear, structured format with sections and subsections.
    Cite sources where appropriate.`;

    const defaultSystemPrompt = 'You are a research assistant that provides comprehensive, accurate information.';
    const finalPrompt = prompt || defaultPrompt;
    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: finalSystemPrompt
            },
            {
              role: 'user',
              content: finalPrompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error performing research:', error);
      throw error;
    }
  }
}

module.exports = PerplexityService;
