'use client';

import { useState, useEffect } from 'react';
import { fetchTimeline } from '@/services/api';
import type { TimelineEntry } from '@/types';

export function useTimeline() {
  const [data, setData] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTimeline()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
