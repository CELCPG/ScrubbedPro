-- Create a function to confirm a user's email using SECURITY DEFINER
-- This bypasses RLS on auth.users
CREATE OR REPLACE FUNCTION confirm_user_email(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = auth
AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

-- Create a public function that wraps the auth function
CREATE OR REPLACE FUNCTION confirm_email(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM auth.confirm_user_email(p_user_id);
END;
$$;
