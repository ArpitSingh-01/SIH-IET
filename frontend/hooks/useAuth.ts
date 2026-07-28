'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN_KEY } from '@/utils/constants';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Decode JWT and check expiry
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setIsAuthenticated(false);
        router.push('/login?expired=true');
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  return { isAuthenticated, loading, logout };
}
