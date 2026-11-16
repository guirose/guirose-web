-- 1. Límite de tamaño para la selección (evita filas enormes)
alter table public.cotizaciones
  add constraint seleccion_tamano check (pg_column_size(seleccion) < 20000);

-- 2. Índice para contar los envíos de un celular
create index cotizaciones_celular_fecha
  on public.cotizaciones (celular, creada_en desc);

-- 3. Función que revisa los límites antes de guardar cada cotización
create or replace function public.limitar_envios()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  del_celular int;
  del_minuto int;
begin
  -- máximo 5 cotizaciones (por ahora) por celular en una hora
  select count(*) into del_celular
  from public.cotizaciones
  where celular = new.celular
    and creada_en > now() - interval '1 hour';
  if del_celular >= 5 then
    raise exception 'Demasiadas cotizaciones de este celular en la última hora';
  end if;

  -- máximo 20 cotizaciones en total por minuto para frenar inundacion de mensajes
  select count(*) into del_minuto
  from public.cotizaciones
  where creada_en > now() - interval '1 minute';
  if del_minuto >= 20 then
    raise exception 'Demasiadas cotizaciones en el último minuto';
  end if;

  return new;
end;
$$;

-- solo el disparador usa la función
revoke all on function public.limitar_envios() from public, anon, authenticated;

-- 4. Disparador: ejecuta la función antes de cada inserción
create trigger limitar_envios
  before insert on public.cotizaciones
  for each row execute function public.limitar_envios();