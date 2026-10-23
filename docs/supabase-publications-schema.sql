-- ============================================================================
-- HERVÉ NANFANG — Schéma Publications Éditoriales (Mode Master 70/20/10)
-- Table : publications
-- ============================================================================

create table if not exists publications (
  id                   text primary key,
  title                text not null,
  pillar               text not null check (pillar in ('decouverte', 'autorite', 'conversion')),
  series               text,
  campaign             text,
  source_type          text not null,
  source_slug          text,
  source_title         text,
  is_original_creation boolean default false,
  scheduled_date       text not null,
  scheduled_time       text default '09:00',
  status               text not null check (status in ('idees', 'brouillon', 'a_valider', 'valide', 'programme', 'publie', 'refuse', 'erreur', 'archive')),
  platforms            text[] default '{}',
  content_by_platform  jsonb default '{}',
  hook_variants        text[] default '{}',
  media_url            text,
  link_url             text,
  cta_label            text,
  target_audience      text,
  validation_signature jsonb,
  decision_history     jsonb default '[]',
  metrics              jsonb default '{}',
  rejection_reason     text,
  connector_status     jsonb default '{}',
  notes                text,
  published_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists publications_status_idx on publications (status, scheduled_date desc);
create index if not exists publications_pillar_idx on publications (pillar);

-- Activation Row Level Security
alter table publications enable row level security;

-- Droits Data API
revoke all on table publications from anon, authenticated;
grant select on table publications to anon;
grant select, insert, update, delete on table publications to authenticated;

-- Politiques RLS
-- 1. Lecture publique : autorisée uniquement pour les contenus officiellement publiés
create policy "lecture publique des publications diffusees" on publications
  for select using (status = 'publie' or is_admin());

-- 2. Gestion intégrale (création, modification, validation, suppression) réservée aux administrateurs
create policy "admin gere les publications" on publications
  for all using (is_admin()) with check (is_admin());
