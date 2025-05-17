# AI Article Generation Workflow - Project Structure

## Overview

This document outlines the project structure for the AI Article Generation Workflow application. The application will be a web-based tool that guides users through a multi-phase process of article creation, from topic selection to final HTML output.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (with modern framework)
- **Backend**: Node.js
- **Database/Storage**: none (data is not persisted)
- **Deployment**: Heroku
- **APIs**:
  - OpenAI GPT-4o API for most AI components
  - Perplexity API for research
  - GPT Image API for image generation

## Project Structure

```
ai-article-workflow/
├── src/                      # Source code
│   ├── client/               # Frontend code
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── PromptEditor.js
│   │   │   ├── AIOutput.js
│   │   │   └── ...
│   │   ├── pages/            # Application pages
│   │   │   ├── Home.js
│   │   │   ├── TitlePhase.js
│   │   │   ├── ResearchPhase.js
│   │   │   ├── OutlinePhase.js
│   │   │   ├── DraftPhase.js
│   │   │   ├── FeedbackPhase.js
│   │   │   ├── RevisionPhase.js
│   │   │   ├── VisualsPhase.js
│   │   │   └── PublishPhase.js
│   │   ├── services/         # Frontend services
│   │   │   ├── api.js        # API client
│   │   ├── styles/           # CSS/SCSS files
│   │   ├── utils/            # Utility functions
│   │   ├── App.js            # Main application component
│   │   └── index.js          # Entry point
│   │
│   ├── server/               # Backend code
│   │   ├── api/              # API routes
│   │   │   ├── title.js      # Title generation endpoints
│   │   │   ├── research.js   # Research endpoints
│   │   │   ├── outline.js    # Outline generation endpoints
│   │   │   ├── draft.js      # Draft writing endpoints
│   │   │   ├── critique.js   # Critique generation endpoints
│   │   │   ├── revision.js   # Revision endpoints
│   │   │   ├── image.js      # Image generation endpoints
│   │   │   └── html.js       # HTML formatting endpoints
│   │   ├── config/           # Configuration files
│   │   │   └── env.js        # Environment variables
│   │   ├── middleware/       # Middleware functions
│   │   ├── services/         # Backend services
│   │   │   ├── openai.js     # OpenAI service
│   │   │   ├── perplexity.js # Perplexity service
│   │   ├── utils/            # Utility functions
│   │   └── index.js          # Server entry point
│   │
│   └── shared/               # Shared code between client and server
│       ├── constants.js      # Constants
│       └── validation.js     # Validation functions
│
├── public/                   # Public assets
├── node_modules/             # Dependencies
├── package.json              # Project metadata and dependencies
├── .env                      # Environment variables (not in version control)
├── .gitignore                # Git ignore file
└── README.md                 # Project documentation
```

## API Endpoints

### Backend API Endpoints

1. **Title Generation**
   - `POST /api/title`
   - Generate title suggestions based on theme

2. **Research**
   - `POST /api/research`
   - Perform research based on selected title

3. **Outline Generation**
   - `POST /api/outline`
   - Generate outline options based on title and research

4. **Draft Writing**
   - `POST /api/draft`
   - Generate initial draft based on title, research, and outline

5. **Critique Generation**
   - `POST /api/critique`
   - Generate critique based on draft and user feedback

6. **Revision**
   - `POST /api/revision`
   - Generate revised article based on draft and critique

7. **Image Generation**
   - `POST /api/image`
   - Generate image based on article content

8. **HTML Formatting**
   - `POST /api/html`
   - Format article and images into HTML

