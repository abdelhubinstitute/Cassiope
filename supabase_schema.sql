/**
 * Supabase database schema setup
 */

// This file contains SQL commands to set up the Supabase database schema
// Execute these commands in the Supabase SQL editor

// Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

// Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
);

// Article versions table
CREATE TABLE IF NOT EXISTS article_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, version_number)
);

// Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  ai_component TEXT NOT NULL CHECK (ai_component IN ('title', 'research', 'outline', 'draft', 'critique', 'revision', 'image', 'html')),
  prompt_text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

// Images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

// Create storage bucket for images
-- Run this in Supabase dashboard or via API
-- CREATE BUCKET IF NOT EXISTS images;

// Insert default prompts
INSERT INTO prompts (ai_component, prompt_text, is_default) VALUES
('title', 'Generate 10 creative, engaging title options for an article about "${theme}". The titles should be attention-grabbing, specific, and appropriate for the subject matter. Provide a diverse range of approaches, from straightforward to creative. Return only the titles as a numbered list from 1-10.', TRUE),
('research', 'Perform comprehensive research on the topic: "${title}". Please include: 1. Key facts and statistics 2. Historical context and background 3. Current trends and developments 4. Different perspectives and viewpoints 5. Expert opinions and relevant quotes 6. Potential controversies or debates 7. Future implications or predictions. Organize the information in a clear, structured format with sections and subsections. Cite sources where appropriate.', TRUE),
('outline', 'Based on the title "${title}" and the following research: ${research} Generate 3 different detailed outline options for an article. Each outline should: 1. Have a clear structure with main sections and subsections 2. Cover the key points from the research 3. Have a logical flow from introduction to conclusion 4. Include specific angles or approaches that make it unique. Label each outline as "Option 1", "Option 2", and "Option 3".', TRUE),
('draft', 'Write a comprehensive first draft of an article with the title "${title}" following this outline: ${outline} Use the following research to inform the content: ${research} The article should: 1. Have a compelling introduction that hooks the reader 2. Follow the outline structure precisely 3. Include relevant facts and information from the research 4. Have a clear, engaging writing style 5. End with a strong conclusion. Write a complete article with properly formatted headings, paragraphs, and transitions.', TRUE),
('critique', 'Review the following article draft: ${draft} The user has provided this feedback: ${userFeedback} Generate 3 different constructive critiques of the article. Each critique should: 1. Identify specific strengths of the article 2. Point out areas for improvement 3. Suggest specific changes that would enhance the article 4. Address the user''s feedback points 5. Provide actionable recommendations. Label each critique as "Critique 1", "Critique 2", and "Critique 3".', TRUE),
('revision', 'Revise the following article draft with the title "${title}": ${draft} Based on this critique: ${critique} Use the original outline: ${outline} And the research: ${research} Create a significantly improved version that: 1. Addresses all points in the critique 2. Maintains the strengths of the original draft 3. Enhances clarity, flow, and engagement 4. Ensures accuracy and depth of content 5. Polishes the writing style and formatting. Provide a complete, publication-ready article.', TRUE),
('image', 'Based on the following article: ${article} Create a detailed, specific prompt for generating an image that would complement this article. The prompt should: 1. Capture the main theme or a key concept from the article 2. Be visually descriptive and specific 3. Include style suggestions (photorealistic, illustration, etc.) 4. Specify mood, lighting, and composition elements 5. Be optimized for AI image generation. Provide only the image generation prompt, without explanations or additional text.', TRUE),
('html', 'Convert the following article to clean, well-formatted HTML: ${article} Include this image in an appropriate location (likely near the top): ${imageUrl} The HTML should: 1. Have proper HTML5 structure with doctype, head, and body 2. Include appropriate meta tags 3. Use semantic HTML elements (article, section, h1-h6, p, etc.) 4. Have clean, responsive styling with a modern aesthetic 5. Format the article content properly with paragraphs, headings, and spacing 6. Integrate the image with appropriate sizing and alt text 7. Be mobile-friendly. Provide the complete HTML code.', TRUE);

// Create RLS policies
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read/write their own data
CREATE POLICY user_crud_own ON users
  FOR ALL USING (auth.uid() = id);

-- Articles policies
CREATE POLICY article_select_own ON articles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY article_insert_own ON articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY article_update_own ON articles
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY article_delete_own ON articles
  FOR DELETE USING (auth.uid() = user_id);

-- Article versions policies
CREATE POLICY version_select_own ON article_versions
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM articles WHERE articles.id = article_versions.article_id AND articles.user_id = auth.uid()
  ));
  
CREATE POLICY version_insert_own ON article_versions
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM articles WHERE articles.id = article_versions.article_id AND articles.user_id = auth.uid()
  ));

-- Prompts policies
CREATE POLICY prompt_select_all ON prompts
  FOR SELECT USING (is_default OR auth.uid() = user_id);
  
CREATE POLICY prompt_insert_own ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY prompt_update_own ON prompts
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY prompt_delete_own ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Images policies
CREATE POLICY image_select_own ON images
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM articles WHERE articles.id = images.article_id AND articles.user_id = auth.uid()
  ));
  
CREATE POLICY image_insert_own ON images
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM articles WHERE articles.id = images.article_id AND articles.user_id = auth.uid()
  ));
  
CREATE POLICY image_delete_own ON images
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM articles WHERE articles.id = images.article_id AND articles.user_id = auth.uid()
  ));
