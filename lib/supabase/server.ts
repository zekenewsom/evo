// lib/supabase/server.ts (Corrected Again)
import { createServerClient } from '@supabase/ssr'; // FIX: Removed 'type CookieOptions'
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // FIX: Removed the explicit ': CookieOptions' type from the 'options' parameter
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (_error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        // FIX: Removed the explicit ': CookieOptions' type from the 'options' parameter
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (_error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Utility for Server Actions specifically (This part was already correct)
export function createSupabaseServerActionClient() {
  const cookieStore = cookies();
  return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          cookies: {
              get: (name) => cookieStore.get(name)?.value,
              set: (name, value, options) => cookieStore.set(name, value, options),
              remove: (name, options) => cookieStore.delete(name, options),
          },
      }
  );
}