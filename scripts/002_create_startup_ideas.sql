-- Create startup_ideas table for idea validation
create table if not exists public.startup_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  problem_statement text,
  target_market text,
  solution_approach text,
  validation_score integer default 0,
  validation_data jsonb default '{}',
  status text default 'draft' check (status in ('draft', 'validating', 'validated', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.startup_ideas enable row level security;

-- Create policies for startup_ideas
create policy "startup_ideas_select_own"
  on public.startup_ideas for select
  using (auth.uid() = user_id);

create policy "startup_ideas_insert_own"
  on public.startup_ideas for insert
  with check (auth.uid() = user_id);

create policy "startup_ideas_update_own"
  on public.startup_ideas for update
  using (auth.uid() = user_id);

create policy "startup_ideas_delete_own"
  on public.startup_ideas for delete
  using (auth.uid() = user_id);
