# Architecture

The application has a React/Vite client and a Spring Boot REST API configured for MySQL. The
verification endpoint validates two PDF or image uploads, sends them to the configured Gemini
multimodal model (`gemini-3.6-flash` by default), and returns a structured comparison. Uploads and results are not persisted.
The frontend displays the analysis in a four-step review and also includes an explicitly fictional
sample walkthrough. AI analysis must be treated as an assistive signal, not an authoritative decision.

See `api-spec.md` for the HTTP contract and `prompts.md` for prompt iteration notes.
