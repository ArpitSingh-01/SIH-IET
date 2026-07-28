'use client';

import { useState, useEffect } from 'react';
import { fetchSetting } from '@/services/api';

export function useSettings() {
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchSetting('about_content'),
      fetchSetting('whatsapp_link'),
      fetchSetting('whatsapp_enabled'),
    ])
      .then(([about, link, enabled]) => {
        setAboutContent(about);
        setWhatsappLink(link);
        setWhatsappEnabled(enabled === 'true');
      })
      .catch(() => {
        // Silent failure for settings
      })
      .finally(() => setLoading(false));
  }, []);

  return { aboutContent, whatsappLink, whatsappEnabled, loading };
}
