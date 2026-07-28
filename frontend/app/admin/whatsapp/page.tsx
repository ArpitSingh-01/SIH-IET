'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Loader2, Save, ExternalLink } from 'lucide-react';
import { adminFetch, fetchSetting, isRenderDown } from '@/services/api';

export default function AdminWhatsappPage() {
  const [link, setLink] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [internalName, setInternalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const renderDown = isRenderDown();

  useEffect(() => {
    async function loadSettings() {
      try {
        const [linkVal, enabledVal] = await Promise.all([
          fetchSetting('whatsapp_link'),
          fetchSetting('whatsapp_enabled'),
        ]);
        setLink(linkVal || '');
        setEnabled(enabledVal === 'true');
      } catch {
        setMessage({ type: 'error', text: 'Failed to load WhatsApp settings.' });
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Validate format
      if (link && !link.startsWith('https://chat.whatsapp.com/')) {
        setMessage({ type: 'error', text: 'Link must start with https://chat.whatsapp.com/' });
        setSaving(false);
        return;
      }

      await Promise.all([
        adminFetch('/api/settings/whatsapp_link', {
          method: 'PUT',
          body: JSON.stringify({ value: link || null, updated_by: internalName }),
        }),
        adminFetch('/api/settings/whatsapp_enabled', {
          method: 'PUT',
          body: JSON.stringify({ value: enabled ? 'true' : 'false', updated_by: internalName }),
        }),
      ]);

      setMessage({ type: 'success', text: 'WhatsApp configuration updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save configuration.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded skeleton-shimmer" />
        <div className="h-48 bg-white border border-slate-200 rounded-xl p-6 skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">WhatsApp Integration</h1>

      <div className="max-w-xl bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <label className="text-sm font-semibold text-slate-800">
                Enable WhatsApp Section
              </label>
              <p className="text-xs text-slate-500">
                Show or hide the Join WhatsApp card on the homepage
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              WhatsApp Group Invitation Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400">
              Must be a valid invitation link
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Your Name
            </label>
            <input
              value={internalName}
              onChange={(e) => setInternalName(e.target.value)}
              required
              placeholder="For internal audit trail tracking"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            {enabled && link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]"
              >
                <ExternalLink className="w-4 h-4" />
                Test Link
              </a>
            )}
            <button
              type="submit"
              disabled={saving || renderDown}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors min-h-[44px]"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
