-- Create founder_network table for founder matching
create table if not exists public.founder_network (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skills jsonb default '[]',
  interests jsonb default '[]',
  experience_level text check (experience_level in ('beginner', 'intermediate', 'experienced', 'expert')),
  looking_for jsonb default '[]',
  availability text,
  location text,
  timezone text,
  linkedin_url text,
  twitter_url text,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.founder_network enable row level security;

-- Create policies for founder_network
create policy "founder_network_select_visible"
  on public.founder_network for select
  using (is_visible = true or auth.uid() = user_id);

create policy "founder_network_insert_own"
  on public.founder_network for insert
  with check (auth.uid() = user_id);

create policy "founder_network_update_own"
  on public.founder_network for update
  using (auth.uid() = user_id);

create policy "founder_network_delete_own"
  on public.founder_network for delete
  using (auth.uid() = user_id);
