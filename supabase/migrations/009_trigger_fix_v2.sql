-- Drop all previous trigger attempts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create the trigger function with proper error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.persons (id, user_id, first_name, last_name, current_city, current_state, is_primary)
  VALUES (
    gen_random_uuid(),
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'Your Name'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'current_city', 'Not Set'),
    COALESCE(new.raw_user_meta_data->>'current_state', 'VA'),
    true
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'handle_new_user: %', SQLERRM;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
