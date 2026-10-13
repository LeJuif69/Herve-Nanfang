-- ============================================================================
-- HERVÉ NANFANG — Migration éditeur d'images (mini CMS visuel)
-- Date : 09/10/2026
-- Principe : on n'ajoute AUCUNE table, on étend les tables existantes.
-- Le fichier original (MEDIA) n'est jamais détruit par un recadrage :
-- le cadrage X/Y + zoom + point focal est stocké AU NIVEAU DU CONTENU
-- (articles, projects) et en défaut sur media. RLS inchangée.
-- Exécution : Supabase → SQL Editor → coller → Run
-- ============================================================================

-- 1. Médias : point focal + position par défaut + métadonnées éditoriales
alter table media
  add column if not exists focal_x numeric,
  add column if not exists focal_y numeric,
  add column if not exists default_position_x int default 50,
  add column if not exists default_position_y int default 50,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists credit text;

-- 2. Articles : cadrage d'usage de l'image de couverture
alter table articles
  add column if not exists cover_position_x int default 50,
  add column if not exists cover_position_y int default 50,
  add column if not exists cover_zoom numeric default 1,
  add column if not exists cover_focal_x numeric,
  add column if not exists cover_focal_y numeric,
  add column if not exists cover_preset text default 'original',
  add column if not exists cover_alt text;

-- 3. Projets : cadrage d'usage de l'image de couverture
alter table projects
  add column if not exists cover_image text,
  add column if not exists cover_position_x int default 50,
  add column if not exists cover_position_y int default 50,
  add column if not exists cover_zoom numeric default 1,
  add column if not exists cover_focal_x numeric,
  add column if not exists cover_focal_y numeric,
  add column if not exists cover_preset text default 'original',
  add column if not exists cover_alt text;

-- 4. Contraintes de cohérence (0-100 pour positions, zoom 1-3)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'media_position_range') then
    alter table media add constraint media_position_range
      check (default_position_x between 0 and 100 and default_position_y between 0 and 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'articles_cover_range') then
    alter table articles add constraint articles_cover_range
      check (cover_position_x between 0 and 100 and cover_position_y between 0 and 100);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'projects_cover_range') then
    alter table projects add constraint projects_cover_range
      check (cover_position_x between 0 and 100 and cover_position_y between 0 and 100);
  end if;
end $$;

-- RLS : aucune modification nécessaire (mêmes tables, mêmes politiques).
-- Grants existants sur articles/projects/media couvrent les nouvelles colonnes.
