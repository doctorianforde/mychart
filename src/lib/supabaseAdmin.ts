import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // In production, this would throw an error. In dev, we log it to help debugging.
  console.warn('Missing Supabase environment variables in src/lib/supabaseAdmin.ts');
}

// Create the admin client
// Note: We pass undefined for the second argument if keys are missing in dev,
// but the client will fail if not configured correctly in production.
export const supabaseAdmin = createClient(
  supabaseUrl as string,
  supabaseServiceRoleKey as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);