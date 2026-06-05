# Dental Clinic AI Assistant

A polished Next.js demo for a dental clinic website assistant. It includes a responsive landing page, interactive AI chat widget, lead capture form, and admin dashboard preview.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Run `supabase/migrations/001_create_leads.sql` in your Supabase SQL editor.
2. Copy `.env.example` to `.env.local`.
3. Add your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
4. Restart the Next.js server.

Lead submissions are saved to the `public.leads` table with:

- `name`
- `phone`
- `treatment`
- `preferred_time`
- `message`
- `created_at`
