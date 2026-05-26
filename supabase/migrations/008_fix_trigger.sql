-- Fix handle_new_user trigger to be more robust and not block user creation
-- First drop the problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create a simpler version that just logs if it fails
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into persons table, handling any errors gracefully
  BEGIN
    INSERT INTO persons (
      id,
      user_id,
      first_name,
      last_name,
      current_city,
      current_state,
      is_primary
    ) VALUES (
      gen_random_uuid(),
      new.id,
      COALESCE(new.raw_user_meta_data->>'first_name', 'Your Name'),
      COALESCE(new.raw_user_meta_data->>'last_name', 'User'),
      COALESCE(new.raw_user_meta_data->>'current_city', 'Not Set'),
      COALESCE(new.raw_user_meta_data->>'current_state', 'VA'),
      true
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  END;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
