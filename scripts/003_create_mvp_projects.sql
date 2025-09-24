-- Create mvp_projects table for MVP generation
create table if not exists public.mvp_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id uuid references public.startup_ideas(id) on delete set null,
  name text not null,
  description text,
  tech_stack jsonb default '[]',
  features jsonb default '[]',
  wireframes jsonb default '[]',
  generated_code text,
  deployment_url text,
  status text default 'planning' check (status in ('planning', 'generating', 'completed', 'deployed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.mvp_projects enable row level security;

-- Create policies for mvp_projects
create policy "mvp_projects_select_own"
  on public.mvp_projects for select
  using (auth.uid() = user_id);

create policy "mvp_projects_insert_own"
  on public.mvp_projects for insert
  with check (auth.uid() = user_id);

create policy "mvp_projects_update_own"
  on public.mvp_projects for update
  using (auth.uid() = user_id);

create policy "mvp_projects_delete_own"
  on public.mvp_projects for delete
  using (auth.uid() = user_id);
