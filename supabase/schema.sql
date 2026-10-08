-- Execute no SQL Editor do projeto Supabase.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{"vistos": [], "favoritos": []}'::jsonb,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "Usuários podem ler os próprios dados"
  on public.user_data for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Usuários podem inserir os próprios dados"
  on public.user_data for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Usuários podem atualizar os próprios dados"
  on public.user_data for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
