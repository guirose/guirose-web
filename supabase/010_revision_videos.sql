select cron.schedule(
  'revision-videos-tiktok',
  '40 11 * * *',
  $$
  select net.http_post(
    url := 'https://bwjsaeofxmfjagwqsuce.supabase.co/functions/v1/videos-tiktok',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-guirose-secreto', (select decrypted_secret from vault.decrypted_secrets where name = 'videos_secreto')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);