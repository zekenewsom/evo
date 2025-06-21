'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-100">Welcome Back to Evo</h2>
      <form onSubmit={handleLogin}>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-slate-300">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input input-bordered w-full bg-slate-600 text-slate-100 placeholder-slate-400"
            required
          />
        </div>
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text text-slate-300">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input input-bordered w-full bg-slate-600 text-slate-100 placeholder-slate-400"
            required
          />
        </div>
        <div className="form-control mt-8">
          <button type="submit" className="btn btn-primary w-full text-lg">
            Log In
          </button>
        </div>
      </form>
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      <p className="mt-6 text-center text-slate-300">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="link link-accent">
          Sign Up
        </Link>
      </p>
    </>
  );
}
