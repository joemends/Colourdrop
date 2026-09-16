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


## Authentication
- `sign-in.html` supports Sign In, account creation, and password-reset requests.
- `reset-password.html` securely sets a new password after a Supabase recovery link is opened.
- In Supabase Dashboard → Authentication → URL Configuration, add the deployed site URL and the `reset-password.html` URL to Redirect URLs. For GitHub Pages, use your actual repository Pages path (for example, `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/reset-password.html`).
- If email confirmation is enabled in Supabase, new accounts must confirm their email before signing in.

## Password Reset
The authentication flow includes `reset-password.html`. Configure Supabase Authentication → URL Configuration so the deployed site allows the reset callback URL:
`https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/reset-password.html`
The Sign In page's “Forgot your password?” form sends users to this page after they click the email reset link.


## Authentication pages
- `sign-in.html` — sign in
- `sign-up.html` — create account
- `forgot-password.html` — request password reset
- `reset-password.html` — **enter the new password** after opening the email link
- `logout.html` — securely sign out and return to sign in

## Website logo
Admin → Logo lets an authenticated user upload a new site logo. The URL is saved in `site_settings` and loaded across the public pages. Run the latest `supabase/schema.sql` before using this feature.
