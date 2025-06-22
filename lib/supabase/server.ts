// lib/supabase/server.ts (Corrected)
import { createServerClient } from '@supabase/ssr';
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
        set(name: string, value: string, options) {
          try { cookieStore.set({ name, value, ...options }); } catch (_error) { /* Ignored */ }
        },
        remove(name: string, options) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (_error) { /* Ignored */ }
        },
      },
    }
  );
}