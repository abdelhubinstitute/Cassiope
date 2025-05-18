/**
 * OpenAI service for GPT-4o and GPT Image API interactions
 */

const { OpenAI } = require('openai');
const { OPENAI_API_KEY } = require('./env');

function getOpenAIClient(apiKey = OPENAI_API_KEY) {
  let options = { apiKey: apiKey || OPENAI_API_KEY };
  if (apiKey && apiKey.startsWith('sk-proj-')) {
    const match = apiKey.match(/^sk-proj-([a-zA-Z0-9]+)-/);
    if (match) {
      options.project = match[1];
    }
  }
  return new OpenAI(options);
}

class OpenAIService {
  constructor(apiKey = OPENAI_API_KEY) {
    this.client = getOpenAIClient(apiKey);
  }

  /**
   * Generate title suggestions based on a theme
   * @param {string} theme - The initial theme/topic
   * @returns {Promise<Array>} - Array of title suggestions
   */
  async generateTitles(theme/*, prompt, systemPrompt*/) {
    const finalPrompt = `Generate 10 creative, engaging title options for an article about "${theme}". 
    The titles should be attention-grabbing, specific, and appropriate for the subject matter. 
    Provide a diverse range of approaches, from straightforward to creative. 
    Return only the titles as a numbered list from 1-10.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      // Extract titles from the response
      const content = response.choices[0].message.content;
      const titles = content.split('\n')
        .filter(line => line.trim().match(/^\d+\.\s/))
        .map(line => line.replace(/^\d+\.\s/, '').trim());

      return titles.slice(0, 10); // Ensure we return exactly 10 titles
    } catch (error) {
      console.error('Error generating titles:', error);
      throw error;
    }
  }

  /**
   * Generate outline options based on title and research
   * @param {string} title - The selected title
   * @param {string} research - Research results
   * @returns {Promise<Array>} - Array of outline options
   */
  async generateOutlines(title, research/*, prompt, systemPrompt*/) {
    const finalPrompt = `Based on the title "${title}" and the following research:
    
    ${research}
    
    Generate 3 different detailed outline options for an article. Each outline should:
    1. Have a clear structure with main sections and subsections
    2. Cover the key points from the research
    3. Have a logical flow from introduction to conclusion
    4. Include specific angles or approaches that make it unique
    
    Label each outline as "Option 1", "Option 2", and "Option 3".`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      // Extract outlines from the response
      const content = response.choices[0].message.content;
      
      // Split by "Option" headers and filter out empty strings
      const outlines = content.split(/Option \d+:/g)
        .filter(text => text.trim().length > 0)
        .map(text => text.trim());

      return outlines.slice(0, 3); // Ensure we return exactly 3 outlines
    } catch (error) {
      console.error('Error generating outlines:', error);
      throw error;
    }
  }

  /**
   * Generate initial draft based on title, research, and outline
   * @param {string} title - The selected title
   * @param {string} research - Research results
   * @param {string} outline - Selected outline
   * @returns {Promise<string>} - Generated draft
   */
  async generateDraft(title, research, outline/*, prompt, systemPrompt*/) {
    const finalPrompt = `Write a comprehensive first draft of an article with the title "${title}" following this outline:
    
    ${outline}
    
    Use the following research to inform the content:
    
    ${research}
    
    The article should:
    1. Have a compelling introduction that hooks the reader
    2. Follow the outline structure precisely
    3. Include relevant facts and information from the research
    4. Have a clear, engaging writing style
    5. End with a strong conclusion
    
    Write a complete article with properly formatted headings, paragraphs, and transitions.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.6,
        max_tokens: 4000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating draft:', error);
      throw error;
    }
  }

  /**
   * Generate critique options based on draft and user feedback
   * @param {string} draft - The initial draft
   * @param {string} userFeedback - User feedback on the draft
   * @returns {Promise<Array>} - Array of critique options
   */
  async generateCritiques(draft, userFeedback/*, prompt, systemPrompt*/) {
    const finalPrompt = `Review the following article draft:
    
    ${draft}
    
    The user has provided this feedback:
    
    ${userFeedback}
    
    Generate 3 different constructive critiques of the article. Each critique should:
    1. Identify specific strengths of the article
    2. Point out areas for improvement
    3. Suggest specific changes that would enhance the article
    4. Address the user's feedback points
    5. Provide actionable recommendations
    
    Label each critique as "Critique 1", "Critique 2", and "Critique 3".`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      // Extract critiques from the response
      const content = response.choices[0].message.content;
      
      // Split by "Critique" headers and filter out empty strings
      const critiques = content.split(/Critique \d+:/g)
        .filter(text => text.trim().length > 0)
        .map(text => text.trim());

      return critiques.slice(0, 3); // Ensure we return exactly 3 critiques
    } catch (error) {
      console.error('Error generating critiques:', error);
      throw error;
    }
  }

  /**
   * Generate revised article based on draft and critique
   * @param {string} title - The selected title
   * @param {string} research - Research results
   * @param {string} outline - Selected outline
   * @param {string} draft - Initial draft
   * @param {string} critique - Selected critique
   * @returns {Promise<string>} - Revised article
   */
  async generateRevision(title, research, outline, draft, critique/*, prompt, systemPrompt*/) {
    const finalPrompt = `Revise the following article draft with the title "${title}":
    
    ${draft}
    
    Based on this critique:
    
    ${critique}
    
    Use the original outline:
    
    ${outline}
    
    And the research:
    
    ${research}
    
    Create a significantly improved version that:
    1. Addresses all points in the critique
    2. Maintains the strengths of the original draft
    3. Enhances clarity, flow, and engagement
    4. Ensures accuracy and depth of content
    5. Polishes the writing style and formatting
    
    Provide a complete, publication-ready article.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.6,
        max_tokens: 4000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating revision:', error);
      throw error;
    }
  }

  /**
   * Generate image prompt based on article content
   * @param {string} article - The final article
   * @returns {Promise<string>} - Generated image prompt
   */
  async generateImagePrompt(article/*, prompt, systemPrompt*/) {
    const finalPrompt = `Based on the following article:
    
    ${article}
    
    Create a detailed, specific prompt for generating an image that would complement this article. The prompt should:
    1. Capture the main theme or a key concept from the article
    2. Be visually descriptive and specific
    3. Include style suggestions (photorealistic, illustration, etc.)
    4. Specify mood, lighting, and composition elements
    5. Be optimized for AI image generation
    
    Provide only the image generation prompt, without explanations or additional text.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating image prompt:', error);
      throw error;
    }
  }

  /**
   * Generate image based on prompt
   * @param {string} imagePrompt - The image generation prompt
   * @returns {Promise<string>} - URL to the generated image
   */
  async generateImage(imagePrompt) {
    try {
      const response = await this.client.images.generate({
        model: "gpt-image-1",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024"
        // gpt-image-1 always returns base64; url format is unsupported
      });

      const base64 = response.data[0].b64_json;
      const dataUrl = `data:image/png;base64,${base64}`;
      return dataUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  /**
   * Format article and image into HTML
   * @param {string} article - The final article
   * @param {string} imageUrl - URL to the generated image
   * @returns {Promise<string>} - Formatted HTML
   */
  async formatHTML(article, imageUrl/*, prompt, systemPrompt*/) {
    let base = `Convert the following article to clean, well-formatted HTML:
      
      ${article}
      `;
    if (imageUrl && !imageUrl.startsWith('data:')) {
      base += `\nInclude this image in an appropriate location (likely near the top):\n${imageUrl}\n`;
    }
    const finalPrompt = `${base}\nThe HTML should:\n1. Have proper HTML5 structure with doctype, head, and body\n2. Include appropriate meta tags\n3. Use semantic HTML elements (article, section, h1-h6, p, etc.)\n4. Have clean, responsive styling with a modern aesthetic\n5. Format the article content properly with paragraphs, headings, and spacing\n6. Be mobile-friendly\n\nProvide the complete HTML code.`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: finalPrompt }
        ],
        temperature: 0.5,
        max_tokens: 4000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error formatting HTML:', error);
      throw error;
    }
  }

  /**
   * Generate 5 search topic ideas based on the main title / theme
   * @param {string} title
   * @returns {Promise<Array<string>>}
   */
  async generateSearchTopics(title/*, systemPrompt*/) {
    const finalPrompt = `You are an investigative journalist brainstorming sub-topics to research a subject on the web.\n\nPropose 5 distinct, concise search queries that would help someone research the topic "${title}" thoroughly.\nReturn them as a simple numbered list.`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: finalPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const content = response.choices[0].message.content;
    return content.split('\n')
      .filter(l => l.trim().match(/^\d+\./))
      .map(l => l.replace(/^\d+\.\s*/, '').trim());
  }

  /**
   * Perform web-search based research for each topic and compile into a single document.
   * This uses GPT-4o search preview ("web_search" tool) under the hood.
   * @param {Array<string>} topics
   * @returns {Promise<string>} consolidated research document
   */
  async performWebResearch(topics/*, systemPrompt*/) {
    const summaries = [];
    for (const topic of topics) {
      try {
        const prompt = `You are a research assistant that performs live web searches and summarises the findings with citations.\n\nSearch the web for "${topic}" and provide a concise (200-300 words) summary of the most authoritative information you find. Include inline citations [1], [2] etc. After the summary, list the sources with their URLs.`;
        const response = await this.client.chat.completions.create({
          model: 'gpt-4o-search-preview',
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 800
        });

        summaries.push(`### ${topic}\n\n${response.choices[0].message.content.trim()}`);
      } catch (err) {
        console.error('Web research error for topic:', topic, err);
      }
    }

    return summaries.join('\n\n---\n\n');
  }
}

module.exports = OpenAIService;
