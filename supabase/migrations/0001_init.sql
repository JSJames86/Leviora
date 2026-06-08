-- Leviora Ventures Client Portal — initial schema

create extension if not exists "pgcrypto";

-- Users -----------------------------------------------------------------
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text check (role in ('admin', 'client')) default 'client',
  created_at timestamptz default now()
);

-- Clients ----------------------------------------------------------------
create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  company_name text,
  phone text,
  intake_email text,
  notes text,
  created_at timestamptz default now()
);

-- Engagements -------------------------------------------------------------
create table engagements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  title text not null,
  package_type text check (package_type in ('alacarte', 'starter', 'growth', 'elevated')),
  status text check (status in ('active', 'review', 'completed', 'paused')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Milestones --------------------------------------------------------------
create table milestones (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid references engagements(id),
  title text not null,
  status text check (status in ('pending', 'in_progress', 'complete')) default 'pending',
  position integer,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Deliverables ------------------------------------------------------------
create table deliverables (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid references engagements(id),
  milestone_id uuid references milestones(id),
  title text not null,
  type text check (type in ('document', 'link')),
  url text,
  created_at timestamptz default now()
);

-- Client Notes ------------------------------------------------------------
create table notes (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid references engagements(id),
  author_id uuid references users(id),
  body text not null,
  created_at timestamptz default now()
);

-- Internal Notes ----------------------------------------------------------
create table internal_notes (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid references engagements(id),
  author_id uuid references users(id),
  body text not null,
  created_at timestamptz default now()
);

-- Notifications -----------------------------------------------------------
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  engagement_id uuid references engagements(id),
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Questionnaire Responses ---------------------------------------------------
create table questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid references engagements(id),
  question_key text not null,
  answer text,
  created_at timestamptz default now()
);

-- Document Templates --------------------------------------------------------
create table document_templates (
  id uuid primary key default gen_random_uuid(),
  service_type text not null,
  template_url text,
  created_at timestamptz default now()
);

-- Generated Documents --------------------------------------------------------
create table generated_documents (
  id uuid primary key default gen_random_uuid(),
  engagement_id uuid references engagements(id),
  template_id uuid references document_templates(id),
  questionnaire_response_id uuid references questionnaire_responses(id),
  storage_url text,
  status text check (status in ('draft', 'reviewed', 'approved', 'sent')) default 'draft',
  generated_at timestamptz default now(),
  reviewed_at timestamptz
);

-- Indexes ------------------------------------------------------------------
create index on clients (user_id);
create index on engagements (client_id);
create index on milestones (engagement_id);
create index on deliverables (engagement_id);
create index on notes (engagement_id);
create index on internal_notes (engagement_id);
create index on notifications (user_id);
create index on questionnaire_responses (engagement_id);
create index on generated_documents (engagement_id);

-- Helper: current user's role (reads from the users table, not auth metadata) --
create or replace function current_user_role()
returns text
language sql
security definer
stable
as $$
  select role from users where id = auth.uid();
$$;

create or replace function current_client_id()
returns uuid
language sql
security definer
stable
as $$
  select id from clients where user_id = auth.uid();
$$;

-- Row Level Security --------------------------------------------------------
alter table users enable row level security;
alter table clients enable row level security;
alter table engagements enable row level security;
alter table milestones enable row level security;
alter table deliverables enable row level security;
alter table notes enable row level security;
alter table internal_notes enable row level security;
alter table notifications enable row level security;
alter table questionnaire_responses enable row level security;
alter table document_templates enable row level security;
alter table generated_documents enable row level security;

-- users: a person can read their own row; admins can read everyone
create policy "users read own" on users
  for select using (id = auth.uid() or current_user_role() = 'admin');
create policy "users update own" on users
  for update using (id = auth.uid());

-- clients: a client can read their own client record; admins read all
create policy "clients read own" on clients
  for select using (user_id = auth.uid() or current_user_role() = 'admin');
create policy "clients admin write" on clients
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- engagements: visible to the owning client and admins
create policy "engagements read own" on engagements
  for select using (client_id = current_client_id() or current_user_role() = 'admin');
create policy "engagements admin write" on engagements
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- milestones: follow engagement visibility, read-only for clients
create policy "milestones read via engagement" on milestones
  for select using (
    exists (
      select 1 from engagements e
      where e.id = milestones.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );
create policy "milestones admin write" on milestones
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- deliverables: follow engagement visibility, read-only for clients
create policy "deliverables read via engagement" on deliverables
  for select using (
    exists (
      select 1 from engagements e
      where e.id = deliverables.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );
create policy "deliverables admin write" on deliverables
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- notes: client-visible thread, both sides may post on their own engagements
create policy "notes read via engagement" on notes
  for select using (
    exists (
      select 1 from engagements e
      where e.id = notes.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );
create policy "notes insert via engagement" on notes
  for insert with check (
    author_id = auth.uid()
    and exists (
      select 1 from engagements e
      where e.id = notes.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );

-- internal_notes: admin only
create policy "internal notes admin only" on internal_notes
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- notifications: a user reads/updates only their own
create policy "notifications read own" on notifications
  for select using (user_id = auth.uid() or current_user_role() = 'admin');
create policy "notifications update own" on notifications
  for update using (user_id = auth.uid());
create policy "notifications admin insert" on notifications
  for insert with check (current_user_role() = 'admin');

-- questionnaire_responses: client owns their answers, admin sees all
create policy "questionnaire read via engagement" on questionnaire_responses
  for select using (
    exists (
      select 1 from engagements e
      where e.id = questionnaire_responses.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );
create policy "questionnaire write via engagement" on questionnaire_responses
  for insert with check (
    exists (
      select 1 from engagements e
      where e.id = questionnaire_responses.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );
create policy "questionnaire update via engagement" on questionnaire_responses
  for update using (
    exists (
      select 1 from engagements e
      where e.id = questionnaire_responses.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );

-- document_templates: readable by everyone authenticated, admin-managed
create policy "templates read" on document_templates
  for select using (auth.uid() is not null);
create policy "templates admin write" on document_templates
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- generated_documents: client sees approved/sent docs for their engagements; admin sees all
create policy "documents read via engagement" on generated_documents
  for select using (
    current_user_role() = 'admin'
    or (
      status in ('approved', 'sent')
      and exists (
        select 1 from engagements e
        where e.id = generated_documents.engagement_id
          and e.client_id = current_client_id()
      )
    )
  );
create policy "documents admin write" on generated_documents
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- Keep engagements.updated_at fresh ----------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger engagements_set_updated_at
  before update on engagements
  for each row execute function set_updated_at();

-- Sync auth.users -> public.users on signup ---------------------------------
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'client')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();
