-- 1. Extensiones
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- 2. Tarea programada: cada minuto, solo si hay algo por enviar
select cron.schedule(
  'kommo-revision',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://bwjsaeofxmfjagwqsuce.supabase.co/functions/v1/enviar-a-kommo',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-guirose-secreto', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'kommo_webhook_secreto'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  )
  where exists (
    select 1 from public.cotizaciones
    where kommo_estado <> 'enviado'
      and kommo_intentos < 5
  );
  $$
);