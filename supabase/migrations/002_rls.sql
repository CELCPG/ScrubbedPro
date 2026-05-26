-- Scrubbed.Pro — RLS Policies
-- Phase 1: Enforce row-level security on all user tables

alter table persons enable row level security;
alter table scans enable row level security;
alter table broker_results enable row level security;
alter table removal_queue enable row level security;
alter table subscriptions enable row level security;
alter table audit_log enable row level security;

-- Persons: users own their own profiles
create policy "persons_select_own" on persons for select using (auth.uid() = user_id);
create policy "persons_insert_own" on persons for insert with check (auth.uid() = user_id);
create policy "persons_update_own" on persons for update using (auth.uid() = user_id);
create policy "persons_delete_own" on persons for delete using (auth.uid() = user_id);

-- Scans: users own their own scan history
create policy "scans_select_own" on scans for select using (auth.uid() = user_id);
create policy "scans_insert_own" on scans for insert with check (auth.uid() = user_id);
create policy "scans_update_own" on scans for update using (auth.uid() = user_id);

-- Broker results: derived from scans, so same ownership
create policy "broker_results_select_own" on broker_results for select using (auth.uid() = user_id);

-- Removal queue: users manage their own queue
create policy "removal_queue_select_own" on removal_queue for select using (auth.uid() = user_id);
create policy "removal_queue_insert_own" on removal_queue for insert with check (auth.uid() = user_id);
create policy "removal_queue_update_own" on removal_queue for update using (auth.uid() = user_id);

-- Subscriptions: users see only their own
create policy "subscriptions_select_own" on subscriptions for select using (auth.uid() = user_id);

-- Audit log: users see only their own
create policy "audit_log_select_own" on audit_log for select using (auth.uid() = user_id);