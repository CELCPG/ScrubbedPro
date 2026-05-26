-- Scrubbed.Pro — Database functions and triggers

-- Function to update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to all tables with updated_at
drop trigger if exists set_updated_at on persons;
create trigger set_updated_at before update on persons
  for each row execute function update_updated_at();

drop trigger if exists set_updated_at on scans;
create trigger set_updated_at before update on scans
  for each row execute function update_updated_at();

drop trigger if exists set_updated_at on subscriptions;
create trigger set_updated_at before update on subscriptions
  for each row execute function update_updated_at();

-- Function to handle new user sign-up — create default person record
create or replace function handle_new_user()
returns trigger as $$
declare
  primary_person_id uuid;
begin
  -- Create a placeholder person record for the new user
  -- User fills in real data on the profile page
  insert into persons (
    user_id,
    first_name,
    last_name,
    current_city,
    current_state,
    is_primary
  ) values (
    new.id,
    'Your Name',  -- placeholder — user updates this
    'Not Set',
    'Not Set',
    'VA',
    true
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: automatically create person record when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Function to log audit events
create or replace function log_audit_event(
  p_user_id uuid,
  p_action text,
  p_resource text default null,
  p_resource_id uuid default null,
  p_metadata jsonb default null,
  p_ip_address text default null
)
returns void as $$
begin
  insert into audit_log (user_id, action, resource, resource_id, metadata, ip_address)
  values (p_user_id, p_action, p_resource, p_resource_id, p_metadata, p_ip_address);
end;
$$ language plpgsql security definer;