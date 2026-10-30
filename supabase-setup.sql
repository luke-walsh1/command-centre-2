-- Run once in Supabase: SQL Editor > New query > paste > Run. Safe to run again.
create table if not exists public.dashboard_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.dashboard_state enable row level security;

drop policy if exists "own row select" on public.dashboard_state;
drop policy if exists "own row insert" on public.dashboard_state;
drop policy if exists "own row update" on public.dashboard_state;
drop policy if exists "own row delete" on public.dashboard_state;

create policy "own row select" on public.dashboard_state
  for select to authenticated using (auth.uid() = user_id);
create policy "own row insert" on public.dashboard_state
  for insert to authenticated with check (auth.uid() = user_id);
create policy "own row update" on public.dashboard_state
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own row delete" on public.dashboard_state
  for delete to authenticated using (auth.uid() = user_id);

-- Live updates between devices (optional but recommended)
do $$ begin
  alter publication supabase_realtime add table public.dashboard_state;
exception when duplicate_object then null;
end $$;
