-- ============================================================================
-- HERVÉ NANFANG — Schéma Supabase
-- Plateforme éditoriale canonique · Étape 3 de la feuille de route
--
-- Exécution : Supabase → SQL Editor → coller → Run
-- Prérequis : aucun (le schéma crée tout ce dont il a besoin)
--
-- Principes :
--   • Le public ne lit que les contenus publiés (Row Level Security).
--   • L'écriture est réservée aux administrateurs authentifiés.
--   • Chaque table porte ses propres métadonnées SEO.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Types
-- ---------------------------------------------------------------------------
create type content_status as enum ('brouillon', 'en_relecture', 'en_cours', 'planifie', 'publie', 'archive');

-- ---------------------------------------------------------------------------
-- 1. Profils administrateurs
--    Un utilisateur Supabase Auth devient administrateur si son email figure ici.
-- ---------------------------------------------------------------------------
create table if not exists admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  full_name   text,
  created_at  timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;

-- La fonction ne renvoie qu'un booléen pour l'utilisateur courant ; elle est
-- nécessaire aux politiques RLS mais n'expose aucune donnée d'administration.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Paramètres du site (identité, coordonnées, réseaux)
-- ---------------------------------------------------------------------------
create table if not exists site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 3. Journal — articles (piliers et notes)
-- ---------------------------------------------------------------------------
create table if not exists articles (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  pillar_number    int,
  title            text not null,
  excerpt          text,
  body             text,                        -- Markdown
  category         text not null,
  series           text,
  reading_time     text,
  status           content_status not null default 'brouillon',
  keywords         text[] default '{}',
  cover_image      text,
  seo_title        text,
  seo_description  text,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists articles_status_idx on articles (status, published_at desc);
create index if not exists articles_category_idx on articles (category);

-- ---------------------------------------------------------------------------
-- 4. Projets (5 familles)
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  family       text not null check (family in ('artistiques', 'pedagogiques', 'technologiques', 'culturels', 'entrepreneuriaux')),
  title        text not null,
  volume       text,
  description  text,
  points       text[] default '{}',
  status       text default 'Actif',
  mark         text,                            -- ® / ™
  external_url text,
  position     int default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 5. Musiques · Vidéos · Formations · Conférences · Événements
-- ---------------------------------------------------------------------------
create table if not exists tracks (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  artist        text default 'Hervé Nanfang',
  album         text,
  duration      text,
  audio_url     text,
  cover_image   text,
  streaming     jsonb default '{}',             -- { spotify: "...", youtube: "..." }
  released_at   date,
  created_at    timestamptz not null default now()
);

create table if not exists videos (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  provider     text default 'youtube',
  provider_id  text,                            -- ID vidéo → VideoObject
  description  text,
  thumbnail    text,
  duration_iso text,                            -- format ISO 8601, ex. PT4M13S
  published_at timestamptz,
  category     text,
  created_at   timestamptz not null default now()
);

create table if not exists courses (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  description    text,
  program        text,
  audience       text,
  duration       text,
  mode           text[] default '{onsite,online}',
  price_info     text,
  provider       text default 'Racines Musicales Academy®',
  status         content_status not null default 'brouillon',
  created_at     timestamptz not null default now()
);

create table if not exists talks (
  id           uuid primary key default gen_random_uuid(),
  theme        text not null,                   -- Musique & IA, Pédagogie, Carrière…
  title        text not null,
  pitch        text,
  audience     text,
  formats      text[] default '{}',
  status       content_status not null default 'brouillon',
  created_at   timestamptz not null default now()
);

create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  kind         text check (kind in ('concert', 'conference', 'masterclass', 'atelier', 'formation')),
  description  text,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  venue        text,
  city         text,
  country      text default 'CM',
  ticket_url   text,
  is_public    boolean default true,
  created_at   timestamptz not null default now()
);
create index if not exists events_starts_idx on events (starts_at);

-- ---------------------------------------------------------------------------
-- 6. Médias (références vers Supabase Storage)
-- ---------------------------------------------------------------------------
create table if not exists media (
  id           uuid primary key default gen_random_uuid(),
  bucket       text not null default 'public-media',
  path         text not null,
  alt_text     text,                            -- obligatoire à la publication
  caption      text,
  width        int,
  height       int,
  mime_type    text,
  size_bytes   bigint,
  tags         text[] default '{}',
  created_at   timestamptz not null default now(),
  unique (bucket, path)
);

create table if not exists documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  bucket       text not null default 'private-docs',
  path         text not null,
  is_public    boolean default false,
  kind         text,                            -- manuel, dossier de presse, biographie…
  created_at   timestamptz not null default now(),
  unique (bucket, path)
);

-- ---------------------------------------------------------------------------
-- 7. Messages du formulaire — un enregistrement par parcours
-- ---------------------------------------------------------------------------
create table if not exists messages (
  id             uuid primary key default gen_random_uuid(),
  route          text not null check (route in ('booking', 'formation', 'conference', 'collaboration', 'presse', 'conseil')),
  name           text not null,
  email          text not null,
  organization   text,
  phone          text,
  event_date     date,
  place          text,
  body           text not null,
  status         text not null default 'nouveau' check (status in ('nouveau', 'en_cours', 'traite', 'archive')),
  internal_notes text,
  ip_hash        text,                          -- anti-abus, sans adresse en clair
  created_at     timestamptz not null default now()
);
create index if not exists messages_status_idx on messages (status, created_at desc);

-- ---------------------------------------------------------------------------
-- 8. Lettre d'information
-- ---------------------------------------------------------------------------
create table if not exists newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  confirmed     boolean default false,
  confirm_token uuid default gen_random_uuid(),
  source        text default 'site',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 9. Redirections SEO
-- ---------------------------------------------------------------------------
create table if not exists redirects (
  id         uuid primary key default gen_random_uuid(),
  from_path  text not null unique,
  to_path    text not null,
  code       int not null default 301,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 10. Horodatage automatique
-- ---------------------------------------------------------------------------
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['articles', 'projects', 'site_settings']
  loop
    execute format('drop trigger if exists trg_touch_%1$s on %1$s', t);
    execute format('create trigger trg_touch_%1$s before update on %1$s for each row execute function touch_updated_at()', t);
  end loop;
end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table admin_users           enable row level security;
alter table site_settings         enable row level security;
alter table articles              enable row level security;
alter table projects              enable row level security;
alter table tracks                enable row level security;
alter table videos                enable row level security;
alter table courses               enable row level security;
alter table talks                 enable row level security;
alter table events                enable row level security;
alter table media                 enable row level security;
alter table documents             enable row level security;
alter table messages              enable row level security;
alter table newsletter_subscribers enable row level security;
alter table redirects             enable row level security;

-- --- Droits Data API : principe du moindre privilège ----------------------
-- Les politiques RLS ci-dessous décident quelles lignes sont accessibles.
-- Les grants déterminent quelles opérations peuvent atteindre ces politiques.
revoke all on table admin_users, site_settings, articles, projects, tracks,
  videos, courses, talks, events, media, documents, messages,
  newsletter_subscribers, redirects from anon, authenticated;

grant select on table site_settings, articles, projects, tracks, videos,
  courses, talks, events, media, documents, redirects to anon;
grant insert on table messages, newsletter_subscribers to anon;

grant select on table admin_users to authenticated;
grant select, insert, update, delete on table site_settings, articles,
  projects, tracks, videos, courses, talks, events, media, documents,
  messages, newsletter_subscribers, redirects to authenticated;

-- --- Lecture publique -------------------------------------------------------
create policy "lecture publique des articles publies" on articles
  for select using (status = 'publie' or is_admin());
create policy "lecture publique des projets" on projects for select using (true);
create policy "lecture publique des musiques" on tracks for select using (true);
create policy "lecture publique des videos" on videos for select using (true);
create policy "lecture publique des cours" on courses
  for select using (status = 'publie' or is_admin());
create policy "lecture publique des conferences" on talks
  for select using (status = 'publie' or is_admin());
create policy "lecture publique des evenements" on events
  for select using (is_public or is_admin());
create policy "lecture publique des medias" on media for select using (true);
create policy "lecture publique des documents publics" on documents
  for select using (is_public or is_admin());
create policy "lecture publique des parametres" on site_settings for select using (true);
create policy "lecture publique des redirections" on redirects for select using (true);

-- --- Écriture réservée aux administrateurs ---------------------------------
create policy "admin ecrit articles" on articles              for all using (is_admin()) with check (is_admin());
create policy "admin ecrit projets" on projects               for all using (is_admin()) with check (is_admin());
create policy "admin ecrit musiques" on tracks                for all using (is_admin()) with check (is_admin());
create policy "admin ecrit videos" on videos                  for all using (is_admin()) with check (is_admin());
create policy "admin ecrit cours" on courses                  for all using (is_admin()) with check (is_admin());
create policy "admin ecrit conferences" on talks              for all using (is_admin()) with check (is_admin());
create policy "admin ecrit evenements" on events              for all using (is_admin()) with check (is_admin());
create policy "admin ecrit medias" on media                   for all using (is_admin()) with check (is_admin());
create policy "admin ecrit documents" on documents            for all using (is_admin()) with check (is_admin());
create policy "admin ecrit parametres" on site_settings       for all using (is_admin()) with check (is_admin());
create policy "admin ecrit redirections" on redirects         for all using (is_admin()) with check (is_admin());
create policy "admin geres messages" on messages              for all using (is_admin()) with check (is_admin());
create policy "admin geres abonnes" on newsletter_subscribers for all using (is_admin()) with check (is_admin());
create policy "admin se voit lui-meme" on admin_users         for select using (auth.uid() = user_id);

-- --- Écriture publique contrôlée (formulaires) -----------------------------
-- Le public peut UNIQUEMENT insérer, jamais lire les messages envoyés.
create policy "depot de message par le public" on messages
  for insert with check (
    length(name) between 2 and 120
    and length(body) between 20 and 5000
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
  );

create policy "inscription a la lettre" on newsletter_subscribers
  for insert with check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$');

-- ============================================================================
-- STORAGE
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('private-docs', 'private-docs', false)
on conflict (id) do nothing;

create policy "lecture publique des medias du site" on storage.objects
  for select using (bucket_id = 'public-media');

create policy "admin gere les medias du site" on storage.objects
  for all using (bucket_id = 'public-media' and is_admin())
  with check (bucket_id = 'public-media' and is_admin());

create policy "admin gere les documents prives" on storage.objects
  for all using (bucket_id = 'private-docs' and is_admin())
  with check (bucket_id = 'private-docs' and is_admin());

-- ============================================================================
-- APRÈS EXÉCUTION
-- ============================================================================
-- 1) Créer un utilisateur dans Authentication → Users (email + mot de passe).
-- 2) L'inscrire comme administrateur :
--    insert into admin_users (user_id, email, full_name)
--    select id, email, 'Hervé Nanfang' from auth.users where email = 'VOTRE_EMAIL';
-- 3) Ne jamais exposer la clé service_role dans le frontend.
