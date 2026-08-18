# Color Drop Impressions

Static website using **GitHub Pages + Supabase**.

## Deployment
1. Push this project to a GitHub repository.
2. In **Settings → Secrets and variables → Actions**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. In **Settings → Pages**, set the source to **GitHub Actions**.
4. Push to `main`. The workflow deploys the site automatically.

The Supabase browser anon key is intended for frontend use. Database/storage security must be enforced with Supabase RLS and storage policies.

## Structure
- Public pages: HTML files in the repository root
- Shared styling: `css/style.css`
- Shared behavior and Supabase logic: `js/main.js`, `js/supabase-app.js`
- Supabase configuration: generated at deployment in `js/supabase-config.js`
- Admin: `sign-in.html` → `admin.html`

The existing Supabase database, authentication, enquiry, services, gallery and admin logic is preserved.
