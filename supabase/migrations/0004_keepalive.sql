create table public.keepalive (
  id smallint primary key default 1,
  pinged_at timestamptz default now(),
  constraint keepalive_single_row check (id = 1)
);

insert into public.keepalive (id) values (1);

alter table public.keepalive enable row level security;

create policy "Allow anon select" on public.keepalive
  for select
  to anon
  using (true);
