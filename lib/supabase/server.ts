// lib/supabase/server.ts (Corrected Again)
import { createServerClient } from '@supabase/ssr'; // FIX: Removed 'type CookieOptions'
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// Utility for Server Actions specifically (This part was already correct)
export async function createSupabaseServerActionClient() {
  const cookieStore = await cookies();
  return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          cookies: {
              get: (name) => cookieStore.get(name)?.value,
          },
      }
  );
}