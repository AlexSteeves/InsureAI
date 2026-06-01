# InsureAI

A full-stack AI insurance demo. Instant policy binding, AI-powered claims decisions, and real-time fraud scoring — no agents, no waiting.


## Live Demo

[**→ View Live Demo**](https://www.alexsteeves.com)

> Built with Next.js, FastAPI, and Claude Sonnet. No signup required.
---

## Tech Stack

### Frontend
- **Next.js 16** — App Router, server and client components
- **TypeScript** — end-to-end type safety
- **Tailwind CSS v4** — CSS-first config with design tokens
- **shadcn/ui** — accessible component primitives

### Backend
- **FastAPI** — async Python REST API
- **SQLAlchemy** — ORM with SQLite in development, PostgreSQL-ready via `DATABASE_URL`
- **Claude Sonnet 4.6** — Anthropic's model handles every claim decision, fraud scoring, and reasoning

### Hosting
- **Vercel** — frontend deployment with automatic CI/CD from GitHub
- **AWS EC2** — backend API server (t3.micro, Ubuntu 24.04)
- **nginx** — reverse proxy, SSL termination
- **Let's Encrypt** — free auto-renewing SSL certificate

---

## Project Structure

```
├── frontend/        # Next.js app
│   ├── app/         # Pages and routes
│   ├── components/  # Shared UI components
│   └── lib/         # API client
├── backend/         # FastAPI app
│   ├── routes/      # API endpoints
│   ├── services/    # AI claim processing
│   └── models.py    # Database models
```

---

## Local Development

**Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # add your ANTHROPIC_API_KEY
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local    # set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```
