# Print Innovation — GitHub + Netlify + Supabase

This is a full static HTML/CSS/JavaScript site with Supabase Auth, Postgres and Storage.

## Architecture

GitHub = source-code repository  
Netlify = hosting + automatic deployment from GitHub  
Supabase = authentication + Postgres database + Storage

GitHub is not the database/server for this setup.

## 1. Create Supabase project

Create a project at https://supabase.com/

Then open SQL Editor and run:

`supabase/schema.sql`

This creates:
- inquiries
- services
- gallery
- reviews
- Row Level Security policies
- site-images Storage bucket and policies

## 2. Create the admin account

In Supabase Dashboard:
Authentication → Users → Add user

Create your administrator email/password.

The Sign In page uses Supabase Auth and sends successful users to `admin.html`.

## 3. Configure Netlify

In your Netlify site:

Project configuration → Environment variables

Add:

SUPABASE_URL = your Supabase Project URL
SUPABASE_ANON_KEY = your Supabase anon/publishable key

Make sure the variables are available to the build.

Netlify runs:

`npm run build`

The build creates `js/supabase-config.js`.

Do NOT put a service_role key in the frontend.

## 4. Connect GitHub

Upload/push this project to your GitHub repository.

Connect that repository to Netlify.

Every push to the configured branch triggers a new Netlify deployment.

## 5. What works

- Responsive website
- Supabase initialization
- Supabase Auth sign-in
- Protected admin page
- Contact/quote submissions stored in `inquiries`
- Admin enquiry table
- Supabase Storage image upload
- Services table ready for CMS use
- Gallery and reviews tables ready for expansion
- Google Maps location iframe
- Multi-page HTML/CSS/JS structure

## Important security note

The Supabase anon/publishable key is intended for use in browser applications. Security comes from Supabase Row Level Security policies.

Never expose:
- service_role key
- database password
- other privileged server secrets

## Local preview

If you open HTML directly with `file://`, Supabase features may not behave like a deployed site. Use a local server such as VS Code Live Server or:

`npx serve .`

For Netlify, the included build configuration handles the browser config generation.
