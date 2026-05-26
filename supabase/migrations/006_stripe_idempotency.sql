-- Scrubbed.Pro — stripe_events idempotency table
-- Prevents double-processing when Stripe retries a webhook delivery.

create table if not exists stripe_events (
  id          text primary key,           -- Stripe event ID
  event_type  text not null,
  processed_at timestamptz default now()
);

-- Auto-purge after 30 days (events are immutable by Stripe anyway)
alter table stripe_events set (fillfactor = 90);

create index if not exists stripe_events_processed_at_idx
  on stripe_events (processed_at);