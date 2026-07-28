'use client';

import { useState, useEffect } from 'react';
import { Info, Loader2, Save, Eye } from 'lucide-react';
import { adminFetch, fetchSetting, isRenderDown } from '@/services/api';

export default function AdminAboutPage() {
  const [content, setContent] = useState('');
  const [internalName, setInternalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const renderDown = isRenderDown();

  useEffect(() => {
    async function loadSetting() {
      try {
        const val = await fetchSetting('about_content');
        setContent(val || '');
      } catch {
        setMessage({ type: 'error', text: 'Failed to load settings.' });
      } finally {
        setLoading(false);
      }
    }
    loadSetting();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await adminFetch('/api/settings/about_content', {
        method: 'PUT',
        body: JSON.stringify({
          value: content || null,
          updated_by: internalName,
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      setMessage({ type: 'success', text: 'About page content updated successfully!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to update content.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded skeleton-shimmer" />
        <div className="h-64 bg-white border border-slate-200 rounded-xl p-6 skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">About SIH</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Editor Pane */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Editor</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                About Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Write description about SIH 2026..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your Name
              </label>
              <input
                value={internalName}
                onChange={(e) => setInternalName(e.target.value)}
                required
                placeholder="For internal audit trail tracking"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Never shown publicly</p>
            </div>

            {message && (
              <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              <button
                type="submit"
                disabled={saving || renderDown}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 ${showPreview ? 'block' : 'hidden md:block'}`}>
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Live Preview</h2>
          {content ? (
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50 min-h-[200px] whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
              {content}
            </div>
          ) : (
            <div className="flex items-center justify-center border border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 min-h-[200px]">
              <span className="text-sm text-slate-400">Content is empty. Click edit to customize description.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
