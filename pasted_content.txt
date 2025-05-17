Here's the app description that I want you to build. 
AI Article Generation Workflow
Phase 1: Topic & Title Refinement
User Input: User provides an initial "thématique" (topic/theme).
AI1 (Title Brainstormer):
Receives: The user's thématique.
Action: Generates 10 alternative wordings or enhanced titles for the topic.
User Action: Selects one preferred title from the 10 suggestions.
Output: Selected Title
Phase 2: Research & Outline Development
3. AI2 (Research Agent - e.g., Perplexity API):
* Receives: The Selected Title.
* Action: Performs a deep research call based on the title.
* Output: Comprehensive Research Results
4. AI3 (Outline Generator):
* Receives: The Selected Title and the Research Results.
* Action: Generates 3 detailed plan/outline ideas for the article.
* User Action: Selects one preferred plan.
* Output: Selected Plan
Phase 3: Initial Draft & Feedback
5. AI4 (Draft Writer):
* Receives: The Selected Title, Research Results, and Selected Plan.
* Action: Writes the first version (V1) of the article.
* Output: Article V1
6. User Feedback & Critique Generation:
* User Action: Reviews Article V1 and provides feedback/comments.
* AI5 (Critic AI):
* Receives: Article V1 and user feedback.
* Action: Generates 3 different versions of criticism/suggestions for improvement.
* User Action: Selects the most relevant criticism.
* Output: Selected Criticism (incorporating user comments)
Phase 4: Revision & Finalization
7. AI6 (Revision Writer):
* Receives: Selected Title, Research Results, Selected Plan, Article V1, and the Selected Criticism.
* Action: Writes the final version (V2) of the article, incorporating the critique.
* Output: Final Article (V2)
Phase 5: Visuals & Publishing
8. AI7 (Image Prompt Creator):
* Receives: The Final Article (V2).
* Action: Generates an image prompt based on the article's content.
* Output: Image Prompt
9. AI8 (Image Generator):
* Receives: The Image Prompt.
* Action: Generates one or more images.
* User Action: (Potentially) selects the best image if multiple are provided.
* Output: Selected Image(s)
10. AI9 (HTML Formatter):
* Receives: The Final Article (V2) and the Selected Image(s).
* Action: Formats the entire article, embedding the image(s), into HTML.
* Output: HTML Document (ready for publishing)
Summary of Components:
User: Provides initial input, makes selections at key stages, and offers feedback.
AI1: Title suggestion and refinement. (4o)
AI2: Deep research (e.g., Perplexity). (Perplexity)
AI3: Article plan/outline generation. (4o)
AI4: Initial article drafting. (4o)
AI5: Critique and revision suggestion. (4o)
AI6: Final article writing based on feedback. (4o)
AI7: Image prompt generation. (4o)
AI8: Image generation.(gpt images)
AI9: HTML formatting and output. (Gemini 2.5 pro)

All the prompts should be accessible in the app and editable with premade prompts that can be edited by the user. It will be hosted on heroku; and uses supabase.
Add in your to do obligatory steps to go look up the documentation for each api as i'm pretty sure your knowledge base cutoff date is too old and changes have happened since. All API keys should be set by the user of the app.