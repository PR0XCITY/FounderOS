-- Create pitch_decks table for pitch deck builder
create table if not exists public.pitch_decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id uuid references public.startup_ideas(id) on delete set null,
  title text not null,
  slides jsonb default '[]',
  template_id text,
  presentation_url text,
  status text default 'draft' check (status in ('draft', 'generating', 'completed', 'shared')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.pitch_decks enable row level security;

-- Create policies for pitch_decks
create policy "pitch_decks_select_own"
  on public.pitch_decks for select
  using (auth.uid() = user_id);

create policy "pitch_decks_insert_own"
  on public.pitch_decks for insert
  with check (auth.uid() = user_id);

create policy "pitch_decks_update_own"
  on public.pitch_decks for update
  using (auth.uid() = user_id);

create policy "pitch_decks_delete_own"
  on public.pitch_decks for delete
  using (auth.uid() = user_id);
