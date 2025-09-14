# Mental Aid Hub

> Mental Aid Hub is a modern, comprehensive web application that provides confidential and accessible mental health support. It includes self-assessments, an AI mental-health chat, curated resources, and a counsellor booking flow.

## Features
- **Secure Authentication** — Email/password auth powered by Supabase with protected routes for sensitive pages.
- **AI Mental Health Chat** — An empathetic chatbot powered by the Gemini API and contextual risk assessment.
- **Mental Health Assessments** — Includes standard tools such as PHQ-9 and GAD-7.
- **Curated Resources** — Articles, audio sessions, videos and PDFs categorized by topic.
- **Counsellor Booking** — Browse counsellors and schedule simulated sessions.
- **Anonymous Mode** — Optional entry without account creation.
- **Multi-language Support** — i18n for English, Hindi, Kashmiri, and Dogri.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS + shadcn/ui
- Backend: Supabase (Auth, Database, Real-time)
- AI: Gemini API
- Routing: React Router DOM

## Getting Started
### Prerequisites
- Node.js v18+ and `npm` installed
- A Supabase project (see `supabase/migrations`)
- A Gemini API key (or other AI credentials)

### Installation
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### Environment variables
Create a `.env` file at the project root and add your keys (Vite requires `VITE_` prefix for client-side envs):

```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-public-anon-key"
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

### Run the app
```bash
npm run dev
```

Open the URL printed by Vite (commonly `http://localhost:5173`).

## Notes
- If you see TypeScript errors about `import.meta.env`, ensure `vite-env.d.ts` exists at the project root (this project includes one).
- If the dev server complains it "can't find .env", make sure you run the command from the project root (where `package.json` and `.env` are located).

## License
<<<<<<< HEAD
This project is provided as-is. Add your license information here.
=======
This project is provided as-is. Add your license information here.
>>>>>>> 490db6e91feaab9c7efafe636672047eb685a689
