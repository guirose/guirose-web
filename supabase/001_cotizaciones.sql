-- 1. Tabla de cotizaciones
create table public.cotizaciones (
  -- identificador
  id uuid primary key,
  creada_en timestamptz not null default now(),
  estado text not null default 'nueva'
    check (estado in ('nueva', 'en_atencion', 'cerrada', 'descartada')),

  -- datos del cliente
  nombre text not null check (char_length(nombre) between 3 and 100),
  celular text not null check (celular ~ '^9[0-9]{8}$'),
  tipo_documento text not null check (tipo_documento in ('dni', 'ruc', 'ce')),
  documento text not null,
  correo text check (
    correo is null
    or (char_length(correo) <= 254 and correo ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
  ),
  comentario text check (comentario is null or char_length(comentario) <= 500),
  acepta_privacidad boolean not null check (acepta_privacidad),

  -- equipo elegido
  tipo_motor text not null check (tipo_motor in ('2-tiempos', '4-tiempos')),
  modelo text not null check (char_length(modelo) between 2 and 20),
  seleccion jsonb not null check (jsonb_typeof(seleccion) = 'object'),
  sin_equipamiento boolean not null default false,
  mensaje text not null check (char_length(mensaje) <= 6000),

  -- el documento según su tipo
  constraint documento_valido check (
    (tipo_documento = 'dni' and documento ~ '^[0-9]{8}$')
    or (tipo_documento = 'ruc' and documento ~ '^(10|15|16|17|20)[0-9]{9}$')
    or (tipo_documento = 'ce' and documento ~ '^[A-Z0-9]{8,12}$')
  )
);

-- 2. Seguridad por filas
alter table public.cotizaciones enable row level security;

-- 3. Permisos, solo se podrán insertar a estas columnas
revoke all on table public.cotizaciones from anon, authenticated;
grant insert (
  id, nombre, celular, tipo_documento, documento, correo, comentario,
  acepta_privacidad, tipo_motor, modelo, seleccion, sin_equipamiento, mensaje
) on table public.cotizaciones to anon;

-- 4. Politica, se podran agregar cotizaciones nuevas y aceptadas
create policy "El visitante solo puede enviar cotizaciones"
  on public.cotizaciones
  for insert
  to anon
  with check (estado = 'nueva' and acepta_privacidad);