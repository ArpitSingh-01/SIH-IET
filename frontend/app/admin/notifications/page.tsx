'use client';

import { useState, useEffect } from 'react';
import { Send, Bell, Loader2, Info } from 'lucide-react';
import { adminFetch, isRenderDown } from '@/services/api';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; cleaned: number } | null>(null);
  const [error, setError] = useState('');

  const renderDown = isRenderDown();

  useEffect(() => {
    async function loadCount() {
      try {
        const res = await adminFetch('/api/notifications/count');
        if (res.ok) {
          const data = await res.json();
          setTokenCount(data.count);
        }
      } catch {
        // Ignored
      } finally {
        setLoading(false);
      }
    }
    loadCount();
  }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError('');
    setResult(null);

    try {
      const res = await adminFetch('/api/notifications/send', {
        method: 'POST',
        body: JSON.stringify({ title, body, url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send notifications.');
      }

      const data = await res.json();
      setResult(data);
      setTitle('');
      setBody('');
      setUrl('/');
      // Refresh count
      const countRes = await adminFetch('/api/notifications/count');
      if (countRes.ok) {
        const c = await countRes.json();
        setTokenCount(c.count);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send notifications.');
    } finally {
      setSending(false);
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
      <h1 className="text-2xl font-semibold text-slate-900">Push Notifications</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Send Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Broadcast Notification</h2>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              This will send a real-time push notification to all subscribed devices. Currently registered devices: <span className="font-semibold">{tokenCount ?? 'unknown'}</span>.
            </p>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notification Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={50}
                placeholder="e.g. Hackathon Registration Extension"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 text-right mt-1">{title.length}/50</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notification Message Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                maxLength={200}
                rows={3}
                placeholder="Write a clear and concise broadcast message..."
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 text-right mt-1">{body.length}/200</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Target URL Redirect (optional)
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl p-3 space-y-1">
                <p className="font-semibold">Notification Broadcast Finished:</p>
                <p>• Successfully sent: {result.sent} devices</p>
                <p>• Failed / Expired cleaned: {result.cleaned} tokens removed</p>
              </div>
            )}

            <button
              type="submit"
              disabled={sending || renderDown}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Broadcast to Subscribed Devices
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-900 rounded-2xl shadow-inner border border-slate-800 p-6 flex flex-col justify-center items-center min-h-[300px]">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Notification Device Mockup</h2>
          
          <div className="w-full max-w-[280px] bg-slate-800/90 border border-slate-700/50 backdrop-blur rounded-2xl shadow-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <img 
                  src="/images/sih-logo.png" 
                  alt="SIH Logo" 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-semibold text-slate-300">SIH 2026</span>
              </div>
              <span className="text-[10px] text-slate-500">now</span>
            </div>
            
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white truncate">
                {title || 'Mockup Notification Title'}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2">
                {body || 'This is how your message body text will look on a user\'s mobile lock screen or desktop notification banner.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
