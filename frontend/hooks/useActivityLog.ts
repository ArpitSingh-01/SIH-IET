'use client';

import { useState, useCallback } from 'react';
import { adminFetch } from '@/services/api';
import type { ActivityLog } from '@/types';

export function useActivityLog() {
  const [data, setData] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(async (offset: number = 0, limit: number = 20) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/activity?limit=${limit}&offset=${offset}`);
      if (!res.ok) throw new Error('Failed to fetch activity');
      const result = await res.json();
      setData(result.data);
      setTotal(result.total);
    } catch {
      // Silent failure
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, total, loading, fetchPage };
}
