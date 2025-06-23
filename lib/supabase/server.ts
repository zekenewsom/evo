// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          // Get a fresh instance of the cookie store on every read
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            // Get a fresh instance of the cookie store on every write
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            // Get a fresh instance of the cookie store on every delete
            const cookieStore = await cookies();
            cookieStore.set({ name, value: '', ...options });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}