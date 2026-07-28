'use client';

import { useState, useEffect } from 'react';
import { fetchContacts } from '@/services/api';
import type { Contact } from '@/types';

export function useContacts() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchContacts()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
