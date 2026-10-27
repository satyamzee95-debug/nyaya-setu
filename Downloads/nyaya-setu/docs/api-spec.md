# API specification

## Health

- `GET /api/v1/health` — service status.

## Verification

- `POST /api/v1/verify` — multipart upload fields `landDeed` and `taxReceipt`. Accepts valid
  PDF, JPEG/JPG, PNG, and WebP files up to 10 MB each. Returns a case ID, review status, priority
  score, summary, field-by-field comparison, and review flags. Invalid uploads return `400`;
  oversized uploads `413`; missing AI configuration `503`; and AI-provider/response failures `502`.
- `GET /api/v1/reports/{id}` — planned report retrieval.
- `GET /api/v1/reports/{id}/download` — planned PDF report download.
- `GET /api/v1/history` — planned case history.

The verification route calls the backend-configured Gemini model and requires `GEMINI_API_KEY`.
The uploaded documents and generated result are not persisted. Report download and history routes
are not implemented yet. The frontend sample walkthrough is entirely fictional and does not call AI.
