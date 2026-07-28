'use client';

import { useState, useEffect } from 'react';
import { fetchAnnouncements } from '@/services/api';
import type { Announcement } from '@/types';

export function useAnnouncements() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAnnouncements()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
