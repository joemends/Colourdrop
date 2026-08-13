
-- PRINT INNOVATION SUPABASE SETUP
-- Run this in Supabase Dashboard > SQL Editor.
-- IMPORTANT: keep RLS enabled. Never put a service_role key in frontend code.

create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  quantity integer,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Public visitors may submit enquiries.
drop policy if exists "public can submit inquiries" on public.inquiries;
create policy "public can submit inquiries"
on public.inquiries for insert
to anon, authenticated
with check (true);

-- Only authenticated users can read enquiries.
drop policy if exists "authenticated can read inquiries" on public.inquiries;
create policy "authenticated can read inquiries"
on public.inquiries for select
to authenticated
using (true);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  tags text[] default '{}',
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

drop policy if exists "public can read published services" on public.services;
create policy "public can read published services"
on public.services for select
to anon, authenticated
using (published = true);

drop policy if exists "authenticated can manage services" on public.services;
create policy "authenticated can manage services"
on public.services for all
to authenticated
using (true)
with check (true);

-- Optional gallery table.
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text,
  alt_text text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

drop policy if exists "public can read published gallery" on public.gallery;
create policy "public can read published gallery"
on public.gallery for select
to anon, authenticated
using (published = true);

drop policy if exists "authenticated can manage gallery" on public.gallery;
create policy "authenticated can manage gallery"
on public.gallery for all
to authenticated
using (true)
with check (true);

-- Optional reviews table.
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company text,
  quote text not null,
  rating integer default 5,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "public can read published reviews" on public.reviews;
create policy "public can read published reviews"
on public.reviews for select
to anon, authenticated
using (published = true);

drop policy if exists "authenticated can manage reviews" on public.reviews;
create policy "authenticated can manage reviews"
on public.reviews for all
to authenticated
using (true)
with check (true);

-- Create initial service records.
insert into public.services (title,category,description,tags,sort_order)
select * from (values
('Large Format','Large Format','High-impact indoor and outdoor displays for maximum visibility.','{"Billboards","Flexi Banners","Pull-ups","Telescopic Flags","Display Stands","SAV"}',1),
('Print Management','Print Management','Offset, digital and screen printing with reliable production quality.','{"Offset","Digital","Screen"}',2),
('Stationery & Literature','Stationery & Literature','Professional corporate stationery and literature for a polished brand.','{"Annual Reports","Magazines","Yearbooks","Newsletters","Letterheads","Business Cards"}',3),
('Publicity','Publicity','Marketing materials that communicate campaigns clearly and professionally.','{"Flyers","Product Packaging","Point-of-Sale"}',4),
('Corporate Gifts','Corporate Gifts','Custom branded gifts for clients, partners and staff.','{"Calendars","Polo Shirts","Towels","Notebooks","Mugs","Pens"}',5),
('Publishing','Publishing','Books, magazines and reports managed from pre-print to post-print.','{"Editing","Cover Design","Layout","ISBN & Copyright","Amazon Upload"}',6),
('Binding Methods','Binding','Durable professional binding for books, reports and manuals.','{"Perfect Binding","Saddle Stitch","Spiral","Comb"}',7),
('Finishing Methods','Finishing','Premium finishing processes that enhance appearance and durability.','{"Matte","Gloss","Soft Touch","Spot UV","Foil","Embossing","Debossing"}',8)
) as v(title,category,description,tags,sort_order)
where not exists (select 1 from public.services);

-- STORAGE
-- Create a bucket named site-images in Dashboard > Storage, or run:
insert into storage.buckets (id, name, public)
values ('site-images','site-images',true)
on conflict (id) do nothing;

-- Public can view files in the public bucket.
drop policy if exists "public can view site images" on storage.objects;
create policy "public can view site images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-images');

-- Authenticated admins can upload/update/delete.
drop policy if exists "authenticated can upload site images" on storage.objects;
create policy "authenticated can upload site images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-images');

drop policy if exists "authenticated can update site images" on storage.objects;
create policy "authenticated can update site images"
on storage.objects for update
to authenticated
using (bucket_id = 'site-images')
with check (bucket_id = 'site-images');

drop policy if exists "authenticated can delete site images" on storage.objects;
create policy "authenticated can delete site images"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-images');
