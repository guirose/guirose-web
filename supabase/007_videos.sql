-- 1. Listas de opciones
do $$ begin
  create type public.tipo_video as enum ('entrega', 'consejo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.motor_video as enum (
    '2 tiempos 15 HP', '2 tiempos 25 HP', '2 tiempos 40 HP',
    '4 tiempos 15 HP', '4 tiempos 25 HP', '4 tiempos 60 HP', '4 tiempos 75 HP',
    '4 tiempos 90 HP', '4 tiempos 115 HP', '4 tiempos 150 HP', '4 tiempos 200 HP'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.estado_video as enum ('pendiente', 'listo', 'error', 'no_disponible');
exception when duplicate_object then null; end $$;

-- 2. Tabla
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  -- campos que escribe quien carga nuevos videos
  enlace text not null,
  titulo text not null,
  tipo public.tipo_video not null default 'entrega',
  motor public.motor_video,
  lugar text,
  orden integer not null default 100,
  publicado boolean not null default false,
  -- se llenan de forma automática con datos de TikTok
  tiktok_id text,
  tapa_url text,
  estado public.estado_video not null default 'pendiente',
  error text,
  revisado_en timestamptz,
  creado_en timestamptz not null default now(),

  constraint videos_enlace_tiktok check (
    enlace ~ '^https://([a-z]+\.)?tiktok\.com/' and char_length(enlace) <= 300
  ),
  constraint videos_titulo_largo check (char_length(btrim(titulo)) between 5 and 90),
  constraint videos_lugar_largo check (lugar is null or char_length(lugar) <= 60),
  constraint videos_tiktok_id check (tiktok_id is null or tiktok_id ~ '^[0-9]{8,25}$')
);

-- mismo enlace o video de TikTok no se carga dos veces, evita duplicados
create unique index if not exists videos_enlace_unico on public.videos (enlace);
create unique index if not exists videos_tiktok_id_unico on public.videos (tiktok_id) where tiktok_id is not null;
-- orden de los videos
create index if not exists videos_publicados on public.videos (orden, creado_en desc) where publicado and estado = 'listo';

-- 3. Permisos
alter table public.videos enable row level security;

revoke all on table public.videos from anon, authenticated;

-- el visitante solo puede leer estas columnas
grant select (id, titulo, tipo, motor, lugar, orden, tiktok_id, tapa_url, creado_en) on table public.videos to anon, authenticated;

grant select, update on table public.videos to service_role;

drop policy if exists "Ver videos publicados" on public.videos;
create policy "Ver videos publicados" on public.videos
  for select to anon, authenticated
  using (publicado and estado = 'listo');

-- 4. Carpeta pública (Supabase Storage)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tapas-videos', 'tapas-videos', true, 524288, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;