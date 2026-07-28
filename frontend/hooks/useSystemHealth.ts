'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchHealthStatus, isRenderDown } from '@/services/api';
import type { HealthStatus } from '@/types';

export function useSystemHealth(autoRefresh = true) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'primary' | 'fallback'>('primary');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHealthStatus();
      setHealth(data);
      setMode(isRenderDown() ? 'fallback' : 'primary');
    } catch {
      setMode('fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    if (autoRefresh) {
      const interval = setInterval(refresh, 60000);
      return () => clearInterval(interval);
    }
  }, [refresh, autoRefresh]);

  return { health, loading, mode, refresh };
}
