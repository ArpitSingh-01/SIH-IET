'use client';

import { useState, useEffect } from 'react';
import { fetchSchedule } from '@/services/api';
import type { Announcement } from '@/types';

export function useSchedule() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSchedule()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
