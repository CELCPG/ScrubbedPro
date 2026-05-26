/**
 * Supabase RPC functions for scan counter increments.
 * Run this migration to add them to your database.
 */

/*
-- Add these functions to supabase/migrations/005_rpc_functions.sql

-- Increment brokers_with_listings counter
create or replace function increment_broker_found(p_scan_id uuid)
returns void as $$
begin
  update scans
  set brokers_with_listings = brokers_with_listings + 1
  where id = p_scan_id;
end;
$$ language plpgsql security definer;

-- Increment brokers_blocked counter
create or replace function increment_broker_blocked(p_scan_id uuid)
returns void as $$
begin
  update scans
  set brokers_blocked = brokers_blocked + 1
  where id = p_scan_id;
end;
$$ language plpgsql security definer;

-- Increment total_brokers_scanned counter
create or replace function increment_broker_scanned(p_scan_id uuid)
returns void as $$
begin
  update scans
  set total_brokers_scanned = total_brokers_scanned + 1
  where id = p_scan_id;
end;
$$ language plpgsql security definer;
*/