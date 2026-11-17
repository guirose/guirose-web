-- La función del servidor (rol service_role) necesita leer las cotizaciones
-- y marcar si llegaron a Kommo. El visitante sigue sin poder leerlas.
grant select, update on table public.cotizaciones to service_role;