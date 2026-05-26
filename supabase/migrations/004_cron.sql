-- Scrubbed.Pro — Cron Jobs
-- Phase 1: Scheduled maintenance and re-scan triggers

-- Clean up raw scraped HTML older than 24 hours (privacy requirement)
select cron.schedule(
  'cleanup-raw-data',
  '0 * * * *', -- every hour
  $$ update broker_results set raw_data = null
     where scraped_at < now() - interval '24 hours'
     and raw_data is not null; $$
);

-- Trigger monthly re-scans for active subscribers
select cron.schedule(
  'monthly-rescan',
  '0 2 * * *', -- 2am daily, check for due re-scans
  $$ insert into scans (person_id, user_id, status, next_scan_at)
     select p.id, p.user_id, 'queued', null
     from persons p
     join subscriptions s on s.user_id = p.user_id
     where s.status = 'active'
     and p.id not in (
       select person_id from scans
       where started_at > now() - interval '25 days'
     ); $$
);

-- Verify removals 30 days after submission
select cron.schedule(
  'verify-removals',
  '0 3 * * *', -- 3am daily
  $$ update removal_queue
     set status = 'verification_pending',
         next_verification_at = now()
     where status = 'submitted'
     and submitted_at < now() - interval '30 days'; $$
);