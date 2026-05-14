# Carolina Classics NC vs SC Car Show

Netlify-ready React/Vite MVP for the Carolina Classics event website.

## Included

- Public landing page based on the provided JSX design
- Supabase-backed forms for tickets, car registrations, vendors, sponsors, and entertainment
- `/admin` command center with metrics, search, filters, status edits, notes, delete, CSV export, payments view, and NC vs SC battle meter
- Supabase SQL schema with timestamps and MVP RLS policies
- Netlify SPA config

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.

3. Copy `.env.example` to `.env` and fill in:

   ```bash
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   VITE_ADMIN_PASSWORD=
   ```

4. Run locally:

   ```bash
   npm run dev
   ```

5. Build for Netlify:

   ```bash
   npm run build
   ```

## Production Notes

The admin dashboard currently uses simple client-side password protection for MVP speed. Before handling live customer/payment data, replace this with Supabase Auth and tighten the RLS policies in `supabase/schema.sql` so only admin users can read, update, and delete records.

Payment buttons are intentionally placeholders. Replace the marked Pay Now flow in `src/components/FormModal.jsx` with Stripe Checkout, Square, Eventbrite, or static payment links.
