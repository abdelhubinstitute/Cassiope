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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<Array>} - Array of title suggestions
   */
  async generateTitles(theme, prompt, systemPrompt) {
    let basePrompt = `Génère 10 propositions de titres créatifs et accrocheurs pour un article sur "${theme}".
    Les titres doivent retenir l'attention, être précis et adaptés au sujet traité.
    Propose des approches variées, de la plus directe à la plus originale.
    Retourne uniquement la liste numérotée des titres de 1 à 10.`;

    if (prompt) {
      basePrompt += `\n\nInstructions supplémentaires de l'utilisateur :\n${prompt}`;
    }

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: basePrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<Array>} - Array of outline options
   */
  async generateOutlines(title, research, prompt, systemPrompt) {
    const finalPrompt = `À partir du titre "${title}" et des recherches suivantes :

    ${research}

    Propose trois plans détaillés différents pour un article. Chaque plan doit :
    1. Présenter une structure claire avec sections et sous-sections
    2. Couvrir les points clés issus de la recherche
    3. Suivre un déroulé logique de l'introduction à la conclusion
    4. Inclure des angles ou approches spécifiques qui le rendent unique

    Nomme chaque plan "Option 1", "Option 2" et "Option 3".`;

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: finalPrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<string>} - Generated draft
   */
  async generateDraft(title, research, outline, prompt, systemPrompt) {
    const finalPrompt = `Rédige un premier brouillon complet d'un article intitulé "${title}" en suivant ce plan :

    ${outline}

    Utilise les recherches suivantes pour alimenter le contenu :

    ${research}

    L'article doit :
    1. Commencer par une introduction accrocheuse
    2. Suivre le plan exactement
    3. Intégrer les informations pertinentes issues de la recherche
    4. Adopter un style clair et engageant
    5. Se terminer par une conclusion forte

    Écris un article complet avec titres et paragraphes correctement formatés.`;

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: finalPrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<Array>} - Array of critique options
   */
  async generateCritiques(draft, userFeedback, prompt, systemPrompt) {
    const finalPrompt = `Analyse le brouillon d'article suivant :

    ${draft}

    L'utilisateur a fourni ce retour :

    ${userFeedback}

    Génère trois critiques constructives différentes de l'article. Chaque critique doit :
    1. Identifier les points forts du texte
    2. Indiquer les axes d'amélioration
    3. Suggérer des modifications concrètes pour améliorer l'article
    4. Répondre aux remarques de l'utilisateur
    5. Fournir des recommandations actionnables

    Intitule chaque critique "Critique 1", "Critique 2" et "Critique 3".`;

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: finalPrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<string>} - Revised article
   */
  async generateRevision(title, research, outline, draft, critique, prompt, systemPrompt) {
    const finalPrompt = `Révise le brouillon d'article suivant intitulé "${title}" :

    ${draft}

    En tenant compte de cette critique :

    ${critique}

    Utilise le plan original :

    ${outline}

    Ainsi que la recherche :

    ${research}

    Rédige une version nettement améliorée qui :
    1. Prend en compte tous les points de la critique
    2. Conserve les forces du brouillon initial
    3. Améliore la clarté, la fluidité et l'engagement
    4. Garantit l'exactitude et la profondeur du contenu
    5. Peaufine le style et la mise en forme

    Fournis un article complet prêt à être publié.`;

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: finalPrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<string>} - Generated image prompt
   */
  async generateImagePrompt(article, prompt, systemPrompt) {
    const finalPrompt = `À partir de l'article suivant :

    ${article}

    Crée un prompt détaillé et précis pour générer une image illustrant cet article. Le prompt doit :
    1. Refléter le thème principal ou un concept clé de l'article
    2. Être descriptif visuellement et spécifique
    3. Inclure des suggestions de style (photorealiste, illustration, etc.)
    4. Préciser l'ambiance, la lumière et la composition
    5. Être optimisé pour la génération d'images par IA

    Donne uniquement le prompt d'image, sans explications supplémentaires.`;

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: finalPrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} prompt - User-provided prompt
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<string>} - Formatted HTML
   */
  async formatHTML(article, imageUrl, prompt, systemPrompt) {
    let base = `Convertis l'article suivant en HTML propre et bien structuré :

      ${article}
      `;
    if (imageUrl && !imageUrl.startsWith('data:')) {
      base += `\nIntègre cette image à un endroit approprié (probablement en haut) :\n${imageUrl}\n`;
    }
    let finalPrompt = `${base}\nLe code HTML doit :\n1. Respecter la structure HTML5 avec doctype, head et body\n2. Contenir les balises meta adéquates\n3. Utiliser des éléments sémantiques (article, section, h1-h6, p, etc.)\n4. Avoir un style sobre et responsive\n5. Mettre correctement en forme le contenu avec titres et paragraphes\n6. Être adapté au mobile`;

    if (prompt) {
      finalPrompt += `\n\nInstructions supplémentaires de l'utilisateur :\n${prompt}`;
    }

    finalPrompt += `\n\nFournis le code HTML complet.`;

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: finalPrompt });

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages,
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
   * @param {string} systemPrompt - System-provided prompt
   * @param {string} prompt - User-provided prompt
   * @returns {Promise<Array<string>>}
   */
  async generateSearchTopics(title, systemPrompt, prompt) {
    let basePrompt = `Tu es un journaliste d'investigation qui cherche des sous-thèmes à explorer sur le web.\n\nPropose cinq requêtes de recherche distinctes et concises pour étudier en profondeur le sujet "${title}".\nRetourne-les sous la forme d'une liste numérotée.`;
    if (prompt) {
      basePrompt += `\n\nInstructions supplémentaires de l'utilisateur :\n${prompt}`;
    }

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: basePrompt });

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages,
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
   * @param {string} systemPrompt - System-provided prompt
   * @returns {Promise<string>} consolidated research document
   */
  async performWebResearch(topics, systemPrompt) {
    const summaries = [];
    for (const topic of topics) {
      try {
        let prompt = `Tu es un assistant de recherche qui effectue des recherches web en direct et résume les résultats avec des citations.\n\nRecherche sur le web "${topic}" et fournis un résumé concis (200-300 mots) des informations les plus fiables que tu trouves. Inclue des citations entre crochets [1], [2], etc. À la fin du résumé, liste les sources avec leurs URL.`;
        if (systemPrompt) {
          prompt = `${systemPrompt}\n\n${prompt}`;
        }
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
