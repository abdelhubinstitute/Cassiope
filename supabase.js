/**
 * Supabase service helper
 */

const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_URL, SUPABASE_KEY } = require('./env');

class SupabaseService {
  constructor() {
    if (SUPABASE_URL && SUPABASE_KEY) {
      this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
      // No credentials provided – operate in no-op mode so the app can still run locally
      console.warn('[Supabase] SUPABASE_URL / SUPABASE_KEY not set – Supabase features are disabled.');
      this.client = null;
    }
  }

  /**
   * Save an image reference in the `images` table (if Supabase is configured).
   * @param {string} url
   * @param {string|number} articleId
   * @param {string} prompt
   */
  async saveImage(url, articleId, prompt) {
    if (!this.client) return null;

    const { data, error } = await this.client.from('images').insert({
      article_id: articleId,
      url,
      prompt
    }).select().single();

    if (error) {
      console.error('[Supabase] Error saving image:', error);
      throw error;
    }

    return data;
  }
}

module.exports = SupabaseService;
