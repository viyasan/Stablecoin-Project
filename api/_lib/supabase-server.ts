import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

// Service role client — bypasses RLS, used by cron endpoint for inserts
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Anon client — respects RLS, used by read API routes
export const supabaseAnon = createClient(supabaseUrl, anonKey);
