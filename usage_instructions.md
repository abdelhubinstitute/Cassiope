# AI Article Generation Workflow - Usage Instructions

## Overview

This application guides users through a multi-phase process of article creation, from topic selection to final HTML output. It leverages multiple AI models to assist in each phase of the content creation process.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- API keys for:
  - OpenAI (for GPT-4o and GPT Image)
  - Perplexity

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. Set up the Supabase database using the SQL commands in `src/server/config/supabase_schema.sql`

5. Start the application:
   ```
   npm start
   ```

## Using the Application

### API Key Configuration

Before using the application, you need to configure your API keys:

1. Navigate to the Settings page
2. Enter your OpenAI API key and Perplexity API key
3. Save your settings

### Workflow Phases

#### Phase 1: Topic & Title Refinement

1. Enter your initial topic/theme
2. The system will generate 10 alternative title suggestions
3. Select your preferred title to proceed

#### Phase 2: Research & Outline Development

1. The system will perform deep research based on your selected title
2. Review the research results
3. The system will generate 3 detailed outline options
4. Select your preferred outline to proceed

#### Phase 3: Initial Draft & Feedback

1. The system will write the first version of your article
2. Review the draft and provide feedback/comments
3. The system will generate 3 different versions of criticism/suggestions
4. Select the most relevant criticism to proceed

#### Phase 4: Revision & Finalization

1. The system will write the final version of your article, incorporating the critique
2. Review the final article

#### Phase 5: Visuals & Publishing

1. The system will generate an image prompt based on your article
2. An image will be generated based on the prompt
3. The system will format your article and image into HTML
4. Download the HTML document for publishing

### Customizing Prompts

Each AI component uses a default prompt that can be customized:

1. Click the "Edit Prompt" button on any phase
2. Modify the prompt text
3. Save your custom prompt
4. Reset to default if needed

## Deployment to Heroku

1. Create a new Heroku app
2. Connect your GitHub repository
3. Add the following environment variables in Heroku settings:
   - `NODE_ENV=production`
   - `SUPABASE_URL=your_supabase_url`
   - `SUPABASE_KEY=your_supabase_key`
4. Deploy the application

## Troubleshooting

- **API Key Issues**: Ensure your API keys are correctly entered and have the necessary permissions
- **Image Generation Errors**: Check that your OpenAI account has access to GPT Image
- **Supabase Connection Issues**: Verify your Supabase URL and key are correct

## Support

For additional support or questions, please refer to the documentation or contact the developer.
