'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Pin, AlertTriangle, Loader2 } from 'lucide-react';
import { adminFetch, isRenderDown } from '@/services/api';
import { formatDateTime } from '@/utils/formatDate';
import type { AdminAnnouncement } from '@/types';

export default function AnnouncementsPage() {
  const [items, setItems] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminAnnouncement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAnnouncement | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState('');
  const [internalName, setInternalName] = useState('');
  const [pinned, setPinned] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [published, setPublished] = useState(true);

  const renderDown = isRenderDown();

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await adminFetch('/api/announcements');
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {} finally { setLoading(false); }
  }

  function openCreate() {
    setEditing(null);
    setMessage(''); setInternalName(''); setPinned(false); setUrgent(false); setPublished(true);
    setShowForm(true);
  }

  function openEdit(item: AdminAnnouncement) {
    setEditing(item);
    setMessage(item.message); setInternalName(item.internal_name);
    setPinned(item.pinned); setUrgent(item.urgent); setPublished(item.published);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { type: 'announcement', message, internal_name: internalName, pinned, urgent, published };
      if (editing) {
        const res = await adminFetch(`/api/announcements/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) });
        if (!res.ok) throw new Error();
      } else {
        const res = await adminFetch('/api/announcements', { method: 'POST', body: JSON.stringify(body) });
        if (!res.ok) throw new Error();
      }
      setShowForm(false);
      fetchItems();
    } catch {} finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/announcements/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchItems();
    } catch {} finally { setDeleting(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Announcements</h1>
        <button
          onClick={openCreate}
          disabled={renderDown}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 skeleton-shimmer h-24" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {!item.published && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">Draft</span>
                    )}
                    {item.urgent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        <AlertTriangle className="w-3 h-3" />Urgent
                      </span>
                    )}
                    {item.pinned && <Pin className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-3">{item.message}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    by {item.internal_name} · {formatDateTime(item.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(item)} disabled={renderDown} className="p-2 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50" aria-label="Edit">
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} disabled={renderDown} className="p-2 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50" aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Edit' : 'New'} Announcement</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={2000} rows={4}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-400 text-right mt-1">{message.length}/2000</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input value={internalName} onChange={(e) => setInternalName(e.target.value)} required
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="For internal tracking only" />
                <p className="text-xs text-slate-400 mt-1">Never shown publicly</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">Pinned</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-slate-700">Urgent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">Published</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Delete Announcement?</h2>
            <p className="text-sm text-slate-500">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors min-h-[44px]">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
