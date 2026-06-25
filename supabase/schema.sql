-- Carolina Classics NC vs SC Car Show MVP schema
-- Run this in the Supabase SQL editor before using the app.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  buyer_name text not null,
  email text not null,
  phone text,
  ticket_type text not null check (ticket_type in ('General Admission', 'VIP Admission')),
  quantity integer not null default 1 check (quantity > 0),
  total_amount numeric(10,2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  order_status text not null default 'new' check (order_status in ('new', 'confirmed', 'cancelled', 'refunded')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.car_registrations (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  email text not null,
  phone text,
  state text not null check (state in ('NC', 'SC')),
  car_year integer,
  make text not null,
  model text not null,
  category text not null,
  image_url text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'declined', 'waitlist')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  vendor_type text not null,
  booth_size text not null,
  power_needed boolean not null default false,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'declined', 'waitlist')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  sponsorship_level text not null check (sponsorship_level in ('Diamond', 'Platinum', 'Gold', 'Silver')),
  logo_url text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'declined', 'waitlist')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entertainment (
  id uuid primary key default gen_random_uuid(),
  act_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  type text not null check (type in ('DJ', 'Band', 'Model', 'Host', 'Performer')),
  social_link text,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'declined', 'waitlist')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tickets_updated_at on public.tickets;
create trigger tickets_updated_at
before update on public.tickets
for each row execute function public.set_updated_at();

drop trigger if exists car_registrations_updated_at on public.car_registrations;
create trigger car_registrations_updated_at
before update on public.car_registrations
for each row execute function public.set_updated_at();

drop trigger if exists vendors_updated_at on public.vendors;
create trigger vendors_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

drop trigger if exists sponsors_updated_at on public.sponsors;
create trigger sponsors_updated_at
before update on public.sponsors
for each row execute function public.set_updated_at();

drop trigger if exists entertainment_updated_at on public.entertainment;
create trigger entertainment_updated_at
before update on public.entertainment
for each row execute function public.set_updated_at();

create index if not exists tickets_created_at_idx on public.tickets (created_at desc);
create index if not exists car_registrations_state_idx on public.car_registrations (state);
create index if not exists car_registrations_approval_idx on public.car_registrations (approval_status);
create index if not exists vendors_approval_idx on public.vendors (approval_status);
create index if not exists sponsors_approval_idx on public.sponsors (approval_status);
create index if not exists entertainment_approval_idx on public.entertainment (approval_status);

alter table public.tickets enable row level security;
alter table public.car_registrations enable row level security;
alter table public.vendors enable row level security;
alter table public.sponsors enable row level security;
alter table public.entertainment enable row level security;

-- MVP public insert policies let website visitors submit forms with the anon key.
create policy "Public can create ticket orders"
on public.tickets for insert
to anon, authenticated
with check (true);

create policy "Public can create car registrations"
on public.car_registrations for insert
to anon, authenticated
with check (true);

create policy "Public can create vendor signups"
on public.vendors for insert
to anon, authenticated
with check (true);

create policy "Public can create sponsor inquiries"
on public.sponsors for insert
to anon, authenticated
with check (true);

create policy "Public can create entertainment signups"
on public.entertainment for insert
to anon, authenticated
with check (true);

-- Admin dashboard note:
-- This MVP uses a client-side password and the anon key, so select/update/delete
-- policies below are convenient for setup but too open for production.
-- For launch, replace them with Supabase Auth policies limited to an admin role.

create policy "MVP admin can read tickets"
on public.tickets for select
to anon, authenticated
using (true);

create policy "MVP admin can update tickets"
on public.tickets for update
to anon, authenticated
using (true)
with check (true);

create policy "MVP admin can delete tickets"
on public.tickets for delete
to anon, authenticated
using (true);

create policy "MVP admin can read car registrations"
on public.car_registrations for select
to anon, authenticated
using (true);

create policy "MVP admin can update car registrations"
on public.car_registrations for update
to anon, authenticated
using (true)
with check (true);

create policy "MVP admin can delete car registrations"
on public.car_registrations for delete
to anon, authenticated
using (true);

create policy "MVP admin can read vendors"
on public.vendors for select
to anon, authenticated
using (true);

create policy "MVP admin can update vendors"
on public.vendors for update
to anon, authenticated
using (true)
with check (true);

create policy "MVP admin can delete vendors"
on public.vendors for delete
to anon, authenticated
using (true);

create policy "MVP admin can read sponsors"
on public.sponsors for select
to anon, authenticated
using (true);

create policy "MVP admin can update sponsors"
on public.sponsors for update
to anon, authenticated
using (true)
with check (true);

create policy "MVP admin can delete sponsors"
on public.sponsors for delete
to anon, authenticated
using (true);

create policy "MVP admin can read entertainment"
on public.entertainment for select
to anon, authenticated
using (true);

create policy "MVP admin can update entertainment"
on public.entertainment for update
to anon, authenticated
using (true)
with check (true);

create policy "MVP admin can delete entertainment"
on public.entertainment for delete
to anon, authenticated
using (true);
