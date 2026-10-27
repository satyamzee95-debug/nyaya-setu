# Nyaya Setu

Nyaya Setu is a document-review prototype for comparing a land deed with a property-tax receipt.

## Project layout

- `backend/` — Java 17+ Spring Boot API
- `frontend/` — React application powered by Vite
- `docs/` — architecture, API, prompt, and demo documentation
- `ai-lab/` — synthetic test cases and prompt evaluation utilities

## Local development

1. Copy `.env.example` to `.env` in the project root.
2. Set `GEMINI_API_KEY` to a valid Google AI Studio API key and replace the MySQL username/password placeholders with credentials for your local MySQL server.
3. Start the services with `docker compose up --build`.
4. Open `http://localhost:5173`; submit both documents to run a comparison, or choose **Explore sample walkthrough** to see fictional data.

The backend is available at `http://localhost:8080`. MySQL is available on port `3306`.

### Gemini model errors

The configured model must be available to your API key. The default is `gemini-3.8-flash`, which
supports PDF and image inputs. If an old model is set in `.env` or in your shell environment,
change `AI_MODEL` to `gemini-3.8-flash` and restart the backend. A 404 after that can mean the
selected model is unavailable to the API key or project.

`POST /api/v1/verify` accepts `landDeed` and `taxReceipt` multipart fields. Each file must be a
valid PDF, JPEG, PNG, or WebP up to 10 MB. The backend checks file signatures and sends both
documents to the configured Gemini model (default: `gemini-3.8-flash`, which accepts PDF and image
inputs); it does not persist the files or results. The sample
walkthrough uses fictional data only and does not call an AI model.

For local development without Docker, ensure MySQL is running, configure `SPRING_DATASOURCE_URL`,
`DATABASE_USERNAME`, and `DATABASE_PASSWORD` (or their `SPRING_DATASOURCE_*` equivalents) in `.env`, then run
`mvn spring-boot:run` from `backend/`. The backend loads the project-root `.env` file. In a second
terminal, run `npm run dev` from `frontend/`.

If the backend log says MySQL access was denied with `using password: NO`, the project `.env` is
missing or Spring did not load a non-empty `DATABASE_PASSWORD`/`SPRING_DATASOURCE_PASSWORD`.

Never commit `.env`, expose API keys in the frontend, or paste database passwords or email app
passwords into source code. Credentials shared in messages should be revoked and replaced. Use
documents only when authorized to share them with the configured AI provider. AI-assisted
comparisons are informational and must not be treated as a legal determination.
