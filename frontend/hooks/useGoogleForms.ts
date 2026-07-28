'use client';

import { useState, useEffect } from 'react';
import { fetchGoogleForms } from '@/services/api';
import type { GoogleFormLink } from '@/types';

export function useGoogleForms() {
  const [data, setData] = useState<GoogleFormLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchGoogleForms()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
