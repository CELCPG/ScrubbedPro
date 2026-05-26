import { createClient as createSupabase } from '@supabase/supabase-js'

/**
 * Service role client — bypasses RLS.
 * Use ONLY in server-side code (Route Handlers, Server Actions).
 * Never expose this key to the client.
 */
export function createAdminClient() {
  return createSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}