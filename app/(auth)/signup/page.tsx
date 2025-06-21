'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user && !data.session) {
      setMessage('Signup successful! Please check your email to confirm your account.');
    } else if (data.user && data.session) {
      setMessage('Signup successful! Redirecting...');
      router.push('/dashboard');
      router.refresh();
    } else {
      setMessage('Please check your email to confirm your account or try logging in.');
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-100">Create your Evo Account</h2>
      <form onSubmit={handleSignup}>
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
            <span className="label-text text-slate-300">Password (min. 6 characters)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input input-bordered w-full bg-slate-600 text-slate-100 placeholder-slate-400"
            required
            minLength={6}
          />
        </div>
        <div className="form-control mt-8">
          <button type="submit" className="btn btn-primary w-full text-lg">
            Sign Up
          </button>
        </div>
      </form>
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      {message && <p className="text-green-400 mt-4 text-center">{message}</p>}
      <p className="mt-6 text-center text-slate-300">
        Already have an account?{' '}
        <Link href="/login" className="link link-accent">
          Log In
        </Link>
      </p>
    </>
  );
}
