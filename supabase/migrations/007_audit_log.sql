-- Scrubbed.Pro — audit log
-- Record all sensitive actions: subscription changes, profile edits,
-- removal queue operations, account changes.

create index if not exists audit_log_user_id_idx on audit_log (user_id);
create index if not exists audit_log_event_idx on audit_log (action);
create index if not exists audit_log_created_at_idx on audit_log (created_at desc);