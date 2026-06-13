-- Template library: catalog of reusable UI sections + semantic color palettes.
-- Component code lives in the repo (src/lib/library/registry.ts) — these
-- tables are a metadata index only, joined by `slug`. No component code or
-- markup is ever stored here.

-- Templates ----------------------------------------------------------------
create table templates (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,          -- joins to lib/library/registry.ts
  name          text not null,
  category      text not null,
  tags          text[] not null default '{}',
  preview_image text,                          -- storage URL, optional
  prompt        text,                          -- original generation prompt
  version       int not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Palettes -------------------------------------------------------------------
-- Semantic color palettes. owner = 'leviora' or a client id/name.
create table palettes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner       text not null default 'leviora',
  -- base roles only (see lib/library/roles.ts) — shades are generated at
  -- render time by PaletteProvider, so palette rows stay tiny.
  tokens      jsonb not null,
  created_at  timestamptz not null default now()
);

-- Project Templates ------------------------------------------------------------
-- Links a client engagement to a chosen template + the palette to skin it with.
create table project_templates (
  id            uuid primary key default gen_random_uuid(),
  engagement_id uuid not null references engagements(id),
  template_slug text not null references templates(slug),
  palette_id    uuid not null references palettes(id),
  content       jsonb,                         -- per-instance copy overrides
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- Indexes ------------------------------------------------------------------
create index on project_templates (engagement_id);

-- Keep templates.updated_at fresh -------------------------------------------
create trigger templates_set_updated_at
  before update on templates
  for each row execute function set_updated_at();

-- Row Level Security --------------------------------------------------------
alter table templates enable row level security;
alter table palettes enable row level security;
alter table project_templates enable row level security;

-- templates & palettes: staff-only catalog, admin-managed
create policy "templates read staff" on templates
  for select using (current_user_role() = 'admin');
create policy "templates admin write" on templates
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

create policy "palettes read staff" on palettes
  for select using (current_user_role() = 'admin');
create policy "palettes admin write" on palettes
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');

-- project_templates: follow engagement visibility, admin-managed
create policy "project_templates read via engagement" on project_templates
  for select using (
    exists (
      select 1 from engagements e
      where e.id = project_templates.engagement_id
        and (e.client_id = current_client_id() or current_user_role() = 'admin')
    )
  );
create policy "project_templates admin write" on project_templates
  for all using (current_user_role() = 'admin') with check (current_user_role() = 'admin');
