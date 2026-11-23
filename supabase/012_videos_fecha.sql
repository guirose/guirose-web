alter table public.videos
  add column if not exists fecha_tiktok timestamptz;

grant select (fecha_tiktok) on table public.videos to anon, authenticated;