-- Scrubbed.Pro — Base schema
-- Phase 1: Core tables with RLS

create extension if not exists "uuid-ossp";
create extension if not exists "pg_cron";

-- persons: one row per monitored individual
create table persons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  middle_name text,
  age int,
  current_city text not null,
  current_state text not null,
  previous_cities text[] default '{}',
  previous_states text[] default '{}',
  phone_numbers text[] default '{}',
  email_addresses text[] default '{}',
  relatives text[] default '{}',
  is_primary boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- scans: one row per scan run
create table scans (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references persons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text not null default 'queued'
    check (status in ('queued','running','completed','failed','canceled')),
  exposure_score int,
  risk_tier text check (risk_tier in ('CRITICAL','HIGH','MEDIUM','LOW')),
  total_brokers_scanned int default 0,
  brokers_with_listings int default 0,
  brokers_blocked int default 0,
  fields_most_exposed text[] default '{}',
  robocall_risk_brokers text[] default '{}',
  report_json jsonb,
  scan_duration_seconds int,
  started_at timestamptz default now(),
  completed_at timestamptz,
  next_scan_at timestamptz
);

-- broker_results: one row per broker per scan
create table broker_results (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references scans(id) on delete cascade,
  person_id uuid references persons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  broker_id text not null,
  broker_name text not null,
  status text not null
    check (status in ('found','not_found','blocked','error')),
  listing_url text,
  match_confidence float,
  fields_exposed text[] default '{}',
  raw_data jsonb,
  priority text check (priority in ('high','medium','low')),
  robocall_risk boolean default false,
  scraped_at timestamptz default now()
);

-- removal_queue: every opt-out request
create table removal_queue (
  id uuid primary key default gen_random_uuid(),
  person_id uuid references persons(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  broker_result_id uuid references broker_results(id),
  broker_id text not null,
  broker_name text not null,
  status text not null default 'pending'
    check (status in (
      'pending','submitted','verification_pending',
      'verified_removed','re_listed','failed','requires_manual'
    )),
  opt_out_url text,
  opt_out_method text check (opt_out_method in ('web_form','email','manual')),
  requires_id boolean default false,
  priority text check (priority in ('high','medium','low')),
  submitted_at timestamptz,
  verified_removed_at timestamptz,
  re_listed_at timestamptz,
  next_verification_at timestamptz,
  estimated_removal_days int,
  notes text,
  created_at timestamptz default now()
);

-- subscriptions: Stripe billing state
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  stripe_customer_id text unique,
  stripe_sub_id text unique,
  plan text check (plan in ('individual','family','small_biz')),
  status text check (status in ('active','canceled','past_due','trialing','incomplete')),
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- audit_log: track sensitive actions for compliance
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  resource text,
  resource_id uuid,
  metadata jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- Indexes for performance
create index on scans(person_id, started_at desc);
create index on scans(status) where status in ('queued','running');
create index on broker_results(scan_id);
create index on broker_results(person_id, broker_id);
create index on removal_queue(person_id, status);
create index on removal_queue(next_verification_at) where status = 'submitted';
create index on audit_log(user_id, created_at desc);