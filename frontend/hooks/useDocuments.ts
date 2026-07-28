'use client';

import { useState, useEffect } from 'react';
import { fetchDocuments } from '@/services/api';
import type { DocumentAsset } from '@/types';

export function useDocuments(type: 'notice' | 'resource') {
  const [data, setData] = useState<DocumentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDocuments(type)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}
