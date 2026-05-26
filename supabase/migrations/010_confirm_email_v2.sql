-- Drop the broken functions first
DROP FUNCTION IF EXISTS confirm_email(uuid);
DROP FUNCTION IF EXISTS confirm_user_email(uuid);

-- Create function directly in auth schema
CREATE OR REPLACE FUNCTION auth.confirm_user_email(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users 
  SET email_confirmed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;
