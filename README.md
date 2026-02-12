# Latimore Digital Business Card (Vercel All‑in‑One)

This repo hosts:
- A static digital business card (index.html)
- A secure Vercel Serverless Function for Legacy AI (`/api/strategic-advisor`)

## Deploy on Vercel (recommended)
1. Push this repo to GitHub
2. Import the repo into Vercel
3. In Vercel → Project → Settings → Environment Variables, add:
   - `OPENAI_API_KEY` = your OpenAI key (server-side)
   Optional:
   - `OPENAI_MODEL` = model name (defaults to gpt-4.1-mini)
4. Deploy

## Important security note
Do NOT put API keys in the front-end. This project keeps the OpenAI key server-side only.

## Endpoint
POST `/api/strategic-advisor`
Body: `{ "message": "your question" }`
Returns: `{ "reply": "..." }`
