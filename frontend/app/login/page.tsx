'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { BACKEND_URL, AUTH_TOKEN_KEY } from '@/utils/constants';
import { fetchHealthStatus, triggerWakeRender } from '@/services/api';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Backend status
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [waking, setWaking] = useState(false);
  const [wakeProgress, setWakeProgress] = useState('');

  const expired = searchParams.get('expired') === 'true';

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          router.push('/admin');
          return;
        }
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }

    // Check backend status
    checkBackend();
  }, [router]);

  async function checkBackend() {
    try {
      const health = await fetchHealthStatus();
      setBackendOnline(health.backend);
    } catch {
      setBackendOnline(false);
    }
  }

  async function handleWake() {
    setWaking(true);
    setWakeProgress('Starting...');
    const success = await triggerWakeRender((attempt, max) => {
      setWakeProgress(`Attempt ${attempt}/${max}...`);
    });
    setWaking(false);
    setBackendOnline(success);
    setWakeProgress(success ? 'Backend is awake!' : 'Could not wake backend. Try again later.');
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      router.push('/admin');
    } catch {
      setError('Cannot reach backend. Please try waking Render first.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center">
          <img 
            src="/images/sih-logo.png" 
            alt="SIH Logo" 
            className="w-16 h-16 object-contain mx-auto"
          />
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">SIH 2026 | IET DDUGU</h1>
          <p className="mt-1 text-sm text-slate-500">Admin Login</p>
        </div>

        {/* Expired notice */}
        {expired && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-3 text-center">
            Session expired. Please log in again.
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="committee@ietddugu.ac.in"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || backendOnline === false}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Backend Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Backend Status</span>
            {backendOnline === null ? (
              <span className="text-xs text-slate-400">Checking...</span>
            ) : backendOnline ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-700">
                <Wifi className="w-3 h-3" />
                Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-red-600">
                <WifiOff className="w-3 h-3" />
                Sleeping
              </span>
            )}
          </div>

          {backendOnline === false && (
            <div className="space-y-2">
              <button
                onClick={handleWake}
                disabled={waking}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors min-h-[44px]"
              >
                {waking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wifi className="w-4 h-4" />
                )}
                {waking ? 'Waking...' : 'Wake Render'}
              </button>
              {wakeProgress && (
                <p className="text-xs text-center text-slate-500">{wakeProgress}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
