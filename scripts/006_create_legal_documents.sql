-- Create legal_documents table for legal & finance setup
create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('incorporation', 'terms_of_service', 'privacy_policy', 'operating_agreement', 'employment_contract')),
  company_name text not null,
  jurisdiction text not null,
  document_content text,
  template_id text,
  status text default 'draft' check (status in ('draft', 'generating', 'review', 'completed')),
  generated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.legal_documents enable row level security;

-- Create policies for legal_documents
create policy "legal_documents_select_own"
  on public.legal_documents for select
  using (auth.uid() = user_id);

create policy "legal_documents_insert_own"
  on public.legal_documents for insert
  with check (auth.uid() = user_id);

create policy "legal_documents_update_own"
  on public.legal_documents for update
  using (auth.uid() = user_id);

create policy "legal_documents_delete_own"
  on public.legal_documents for delete
  using (auth.uid() = user_id);
