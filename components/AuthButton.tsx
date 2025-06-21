'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  }, [supabase.auth]);

  useEffect(() => {
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchUser, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return <div className="text-sm text-slate-400">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-300 hidden sm:inline">
          {user.email}
        </span>
        <button onClick={handleLogout} className="btn btn-outline btn-accent btn-sm text-xs px-3">
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn btn-primary btn-sm text-xs px-3">
      Login / Sign Up
    </Link>
  );
}
