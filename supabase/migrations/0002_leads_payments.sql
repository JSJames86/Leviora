-- Leviora Ventures — quote intake leads & payments

-- Leads ---------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  business_name text,
  business_stage text check (business_stage in ('idea', 'formed', 'operating')),
  state char(2),
  quote_json jsonb not null,
  quote_total integer not null,
  pass_through_total integer default 0,
  status text check (status in ('new', 'call_booked', 'deposit_paid', 'midpoint_paid', 'completed', 'lost')) default 'new',
  stripe_customer_id text,
  notes text
);

-- Payments --------------------------------------------------------------------
create table payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  lead_id uuid references leads(id),
  milestone text check (milestone in ('full', 'deposit', 'midpoint', 'final', 'subscription')) not null,
  amount integer not null,
  stripe_session_id text,
  stripe_invoice_id text,
  paid_at timestamptz
);

-- Indexes ------------------------------------------------------------------
create index on leads (email);
create index on leads (status);
create index on payments (lead_id);

-- Row Level Security --------------------------------------------------------
alter table leads enable row level security;
alter table payments enable row level security;

-- leads & payments: admin only — all writes go through the service-role client
create policy "leads admin only" on leads
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

create policy "payments admin only" on payments
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');
