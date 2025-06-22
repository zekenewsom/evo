// lib/supabase/server.ts (The Definitive Fix)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// NOTE: This function is now async
export async function createSupabaseServerClient() {
  // FIX: Added 'await' to the cookies() call
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // These are only needed if you update cookies in server components
        set(name: string, value: string, options) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
        },
        remove(name: string, options) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
        },
      },
    }
  );
}


// FIX: This function is also now async
export async function createSupabaseServerActionClient() {
  // FIX: Added 'await' to the cookies() call
  const cookieStore = await cookies();
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