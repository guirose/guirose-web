--  1. estado "procesando" y hora del último intento
alter table public.cotizaciones
  drop constraint if exists cotizaciones_kommo_estado_check;

alter table public.cotizaciones
  add constraint cotizaciones_kommo_estado_check
    check (kommo_estado in ('pendiente', 'procesando', 'enviado', 'error')),
  add column if not exists kommo_intento_en timestamptz;

-- 2. devuelve true si esta llamda puede enviar la cotizacion a Kommo
create or replace function public.reservar_cotizacion(p_id uuid)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  v_celular text;
  v_reservada boolean;
begin
  select celular into v_celular from public.cotizaciones where id = p_id;
  if v_celular is null then
    return false;
  end if;

  -- un turno por celular donde si otra llamada del mismo celular está aquí se pone en espera
  perform pg_advisory_xact_lock(hashtext('kommo:' || v_celular));

  update public.cotizaciones c
     set kommo_estado = 'procesando',
         kommo_intento_en = now()
   where c.id = p_id
     and c.kommo_intentos < 5
     and (
           c.kommo_estado = 'pendiente'
           -- error: reintenta tras 5 min × intentos (5, 10, 15, 20 min)
        or (c.kommo_estado = 'error'
            and coalesce(c.kommo_intento_en, '-infinity') < now() - make_interval(mins => 5 * c.kommo_intentos))
           -- quedó "procesando" más de 3 min: la función se cortó, se libera
        or (c.kommo_estado = 'procesando'
            and coalesce(c.kommo_intento_en, '-infinity') < now() - interval '3 minutes')
         )
     -- nadie más del mismo celular se está enviando ahora
     and not exists (
           select 1 from public.cotizaciones o
            where o.celular = c.celular and o.id <> c.id
              and o.kommo_estado = 'procesando'
              and o.kommo_intento_en >= now() - interval '3 minutes')
     -- en orden: primero las más antiguas pendientes del mismo celular
     and not exists (
           select 1 from public.cotizaciones o
            where o.celular = c.celular and o.id <> c.id
              and o.creada_en < c.creada_en
              and o.kommo_estado = 'pendiente'
              and o.kommo_intentos < 5)
  returning true into v_reservada;

  return coalesce(v_reservada, false);
end;
$$;

-- 3. Solo el servidor puede pedir turno
revoke all on function public.reservar_cotizacion(uuid) from public, anon, authenticated;
grant execute on function public.reservar_cotizacion(uuid) to service_role;