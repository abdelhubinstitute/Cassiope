# API Documentation for AI Article Generation Workflow

## 1. OpenAI GPT-4o API

### Overview
GPT-4o ("o" for "omni") is OpenAI's versatile, high-intelligence flagship model. It accepts both text and image inputs and produces text outputs (including Structured Outputs).

### Key Features
- Accepts text and image inputs
- Produces text outputs (including Structured Outputs)
- Function calling supported
- Structured outputs supported
- 128,000 context window
- 16,384 max output tokens
- Knowledge cutoff: Oct 01, 2023

### Endpoints
- Chat Completions: `v1/chat/completions`
- Fine-tuning: `v1/fine-tuning`
- Image generation: `v1/images/generations`
- Image edit: `v1/images/edits`
- Speech generation: `v1/audio/speech`
- Transcription: `v1/audio/transcriptions`
- Translation: `v1/audio/translations`
- Completions (legacy): `v1/completions`

### Authentication
- Bearer token authentication using API key
- API key format: `sk-...`

### Pricing
- $2.50 per 1M tokens

## 2. Perplexity API

### Overview
Perplexity provides a RESTful API for accessing their AI models, with a focus on real-time, web-wide research and Q&A capabilities.

### Endpoint
- Chat Completions: `https://api.perplexity.ai/chat/completions`

### Authentication
- Bearer token authentication using API key
- Header format: `Authorization: Bearer <token>`

### Request Format
```python
import requests

url = "https://api.perplexity.ai/chat/completions"

payload = {
    "model": "sonar",
    "messages": [
        {
            "role": "system",
            "content": "Be precise and concise."
        },
        {
            "role": "user",
            "content": "How many stars are there in our galaxy?"
        }
    ]
}
headers = {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)
```

## 3. GPT Image API (OpenAI)

### Overview
The GPT Image API (gpt-image-1) is OpenAI's image generation model. Due to Cloudflare access restrictions, detailed documentation could not be accessed directly.

### Known Information
- Model name: gpt-image-1
- Likely uses the same authentication mechanism as other OpenAI APIs
- Likely endpoint: `v1/images/generations`
- Requires prompt-based input for image generation

### Note
Further research or alternative documentation sources will be needed during implementation.

## 4. Supabase

### Overview
Supabase provides a RESTful API auto-generated from your database schema, allowing direct connection to your database through a RESTful interface.

### Key Features
- Auto-generated API from database schema
- Self-documenting in the Dashboard
- Secure with PostgreSQL's Row Level Security
- Fast and scalable

### REST API
- Base URL: `https://<project_ref>.supabase.co/rest/v1/`
- Supports CRUD operations
- Works with Postgres Views, Materialized Views, and Foreign Tables
- Works with Postgres Functions

### Storage API
- Store images, videos, documents, and other file types
- Global CDN for reduced latency
- Built-in image optimizer for resizing and compressing media files
- Access control framework for files

### Authentication
- API key-based authentication
- Keys available in the Supabase Dashboard

### Implementation Notes
- User will provide their own API keys
- Storage will be used for user data and image storage
