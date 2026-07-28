'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Loader2, Phone, Mail } from 'lucide-react';
import { adminFetch, isRenderDown } from '@/services/api';
import type { Contact } from '@/types';

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(true);

  const renderDown = isRenderDown();

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await adminFetch('/api/contacts');
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {} finally { setLoading(false); }
  }

  function openCreate() {
    setEditing(null);
    setName(''); setPhone(''); setEmail(''); setVisible(true);
    setShowForm(true);
  }

  function openEdit(item: Contact) {
    setEditing(item);
    setName(item.name); setPhone(item.phone || ''); setEmail(item.email || ''); setVisible(item.visible);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name, phone: phone || null, email: email || null, visible, actor: 'admin' };
      if (editing) {
        await adminFetch(`/api/contacts/${editing.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      } else {
        await adminFetch('/api/contacts', { method: 'POST', body: JSON.stringify(body) });
      }
      setShowForm(false);
      fetchItems();
    } catch {} finally { setSaving(false); }
  }

  async function toggleVisibility(item: Contact) {
    try {
      await adminFetch(`/api/contacts/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ visible: !item.visible, actor: 'admin' }),
      });
      fetchItems();
    } catch {}
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/contacts/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchItems();
    } catch {} finally { setDeleting(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Contacts</h1>
        <button onClick={openCreate} disabled={renderDown}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]">
          <Plus className="w-4 h-4" />Add Contact
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 skeleton-shimmer h-20" />
        ))}</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">No contacts yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 ${!item.visible ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    {item.phone && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Phone className="w-3 h-3" />{item.phone}
                      </span>
                    )}
                    {item.email && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Mail className="w-3 h-3" />{item.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleVisibility(item)} disabled={renderDown}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50" aria-label="Toggle visibility">
                    {item.visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  </button>
                  <button onClick={() => openEdit(item)} disabled={renderDown}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50" aria-label="Edit">
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} disabled={renderDown}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50" aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Edit' : 'Add'} Contact</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (optional)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="name@ietddugu.ac.in" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">Visible to public</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Update' : 'Add'}
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
            <h2 className="text-lg font-semibold text-slate-900">Delete Contact?</h2>
            <p className="text-sm text-slate-500">Remove {deleteTarget.name} from the contacts list?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors min-h-[44px]">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
