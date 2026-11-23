-- 0. Lista de opciones para revisar los videos
do $$ begin
  create type public.revision_video as enum ('por_revisar', 'publicado', 'descartado');
exception when duplicate_object then null; end $$;
 -- 1. Columnas nuevas en videos
alter table public.videos
  add column if not exists revision public.revision_video not null default 'por_revisar',
  add column if not exists duracion integer;

-- 2. La casilla "publicado" pasa a ser "revision"
do $$ begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'videos' and column_name = 'publicado'
  ) then
    update public.videos
       set revision = case
         when publicado and (tipo <> 'entrega' or motor is not null)
           then 'publicado'::public.revision_video
         else 'por_revisar'::public.revision_video
       end;
    -- la política y el índice dependían de "publicado"
    drop policy if exists "Ver videos publicados" on public.videos;
    alter table public.videos drop column publicado;
  end if;
end $$;

-- 3. Reglas nuevas
do $$ begin
  alter table public.videos
    add constraint videos_duracion check (duracion is null or duracion between 0 and 3600);
exception when duplicate_object then null; end $$;

-- Un video de entrega no se publica sin elegir el motor
do $$ begin
  alter table public.videos
    add constraint videos_entrega_con_motor
    check (revision <> 'publicado' or tipo <> 'entrega' or motor is not null);
exception when duplicate_object then null; end $$;

-- 4. Permisos de videos
-- El visitante solo ve los publicados y con tapa lista
drop policy if exists "Ver videos publicados" on public.videos;
create policy "Ver videos publicados" on public.videos
  for select to anon, authenticated
  using (revision = 'publicado' and estado = 'listo');

create index if not exists videos_publicados on public.videos (orden, creado_en desc)
  where revision = 'publicado' and estado = 'listo';

-- La función ahora también inserta los videos nuevos
grant select, insert, update on table public.videos to service_role;

-- 5. Autorización de la cuenta de TikTok
-- Una sola fila (la cuenta de la empresa). Solo la función (service_role) la toca.
create table if not exists public.tiktok_cuenta (
  id               boolean primary key default true check (id),
  open_id          text not null,
  access_token     text not null,
  refresh_token    text not null,
  access_expira    timestamptz not null,
  refresh_expira   timestamptz not null,
  scope            text,
  sincronizado_en  timestamptz,
  ultimo_error     text,
  actualizado_en   timestamptz not null default now()
);

alter table public.tiktok_cuenta enable row level security;
revoke all on table public.tiktok_cuenta from anon, authenticated;
grant select, insert, update on table public.tiktok_cuenta to service_role;

create table if not exists public.tiktok_estados (
  estado     text primary key check (estado ~ '^[a-f0-9]{32,64}$'),
  creado_en  timestamptz not null default now()
);

alter table public.tiktok_estados enable row level security;
revoke all on table public.tiktok_estados from anon, authenticated;
grant select, insert, delete on table public.tiktok_estados to service_role;