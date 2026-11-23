-- Evita que dos revisiones de videos corran a la vez.
-- TikTok cambia el token de renovación en cada revisión y el anterior deja de servir:
-- si dos revisiones usaran el mismo token, una fallaría y podría desconectar la cuenta.
-- Se puede ejecutar varias veces sin romper nada.

alter table public.tiktok_cuenta
  add column if not exists sincronizando_desde timestamptz;

comment on column public.tiktok_cuenta.sincronizando_desde is
  'Hora en que empezó la revisión de videos en curso. Vacío = nadie la está usando.';