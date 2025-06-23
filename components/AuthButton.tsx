// components/AuthButton.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    fetchUser();
    const supabase = createSupabaseBrowserClient();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUser, router]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
  };

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-text-medium hidden sm:inline">{user.email}</span>
      <button 
        onClick={handleLogout} 
        className="rounded-md border border-border px-3 py-1.5 text-sm font-semibold text-text transition-colors hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  ) : null;
}