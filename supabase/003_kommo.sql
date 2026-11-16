-- Seguimiento del envío de cada cotización a Kommo
alter table public.cotizaciones
  add column kommo_estado text not null default 'pendiente'
    check (kommo_estado in ('pendiente', 'enviado', 'error')),
  add column kommo_lead_id bigint,
  add column kommo_intentos int not null default 0,
  add column kommo_error text,
  add column kommo_enviado_en timestamptz;

-- índice pequeño para encontrar rápido las que faltan enviar
create index cotizaciones_kommo_pendientes
  on public.cotizaciones (creada_en)
  where kommo_estado <> 'enviado';