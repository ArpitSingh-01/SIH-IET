'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, FileText, Link as LinkIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { adminFetch, isRenderDown } from '@/services/api';
import { BACKEND_URL } from '@/utils/constants';
import type { DocumentAsset } from '@/types';

export default function AdminDocumentsPage() {
  const [activeFilter, setActiveFilter] = useState<'notice' | 'resource'>('notice');
  const [items, setItems] = useState<DocumentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DocumentAsset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DocumentAsset | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'notice' | 'resource'>('notice');
  const [sourceType, setSourceType] = useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [visible, setVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const renderDown = isRenderDown();

  useEffect(() => {
    fetchItems();
  }, [activeFilter]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/documents/${activeFilter}?all=true`);
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setTitle('');
    setDescription('');
    setType(activeFilter);
    setSourceType('file');
    setLinkUrl('');
    setFile(null);
    setVisible(true);
    setErrorMessage('');
    setShowForm(true);
  }

  function openEdit(item: DocumentAsset) {
    setEditing(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setType(item.type);
    setSourceType(item.link_url ? 'link' : 'file');
    setLinkUrl(item.link_url || '');
    setFile(null);
    setVisible(item.visible);
    setErrorMessage('');
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');

    try {
      // Build FormData for multipart uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description || '');
      formData.append('type', type);
      formData.append('visible', String(visible));
      formData.append('actor', 'admin');

      if (type === 'resource' && sourceType === 'link') {
        if (!linkUrl) throw new Error('Reference link URL is required.');
        formData.append('link_url', linkUrl);
      } else {
        if (!editing && !file) {
          throw new Error('Please select a file to upload.');
        }
        if (file) {
          formData.append('file', file);
        }
      }

      const token = localStorage.getItem('sih_admin_token');
      const url = editing ? `${BACKEND_URL}/api/documents/${editing.id}` : `${BACKEND_URL}/api/documents`;
      const method = editing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save document.');
      }

      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred during save.');
    } finally {
      setSaving(false);
    }
  }

  async function handleReorder(index: number, direction: 'up' | 'down') {
    const newItems = [...items];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newItems.length) return;

    [newItems[index], newItems[swapIndex]] = [newItems[swapIndex], newItems[index]];
    const reorderPayload = newItems.map((item, i) => ({ id: item.id, display_order: i }));

    setItems(newItems);
    try {
      await adminFetch(`/api/documents/reorder/${activeFilter}`, {
        method: 'PATCH',
        body: JSON.stringify({ items: reorderPayload, actor: 'admin' }),
      });
    } catch {
      fetchItems();
    }
  }

  async function toggleVisibility(item: DocumentAsset) {
    try {
      await adminFetch(`/api/documents/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ visible: !item.visible, actor: 'admin' }),
      });
      fetchItems();
    } catch {
      // Ignored
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/documents/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchItems();
    } catch {
      // Ignored
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documents Upload</h1>
          <p className="text-sm text-slate-500 mt-1">Upload notice PDFs or dynamic templates into Supabase Storage.</p>
        </div>
        <button
          onClick={openCreate}
          disabled={renderDown}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveFilter('notice')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeFilter === 'notice' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Official Notices
        </button>
        <button
          onClick={() => setActiveFilter('resource')}
          className={`pb-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeFilter === 'resource' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Student Resources
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 skeleton-shimmer h-20" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500">No {activeFilter === 'notice' ? 'notices' : 'resources'} uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm p-4 ${!item.visible ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => handleReorder(index, 'up')} disabled={index === 0 || renderDown}
                    className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors" aria-label="Move up">
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  </button>
                  <button onClick={() => handleReorder(index, 'down')} disabled={index === items.length - 1 || renderDown}
                    className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors" aria-label="Move down">
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
                  {item.link_url ? <LinkIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                  {item.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>}
                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                    {item.link_url ? `Link: ${item.link_url}` : `File: ${item.file_url}`}
                  </p>
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
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Edit' : 'New'} Document</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={150}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={800}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as 'notice' | 'resource')}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="notice">Official Notice</option>
                    <option value="resource">Student Resource</option>
                  </select>
                </div>
                {type === 'resource' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
                    <select value={sourceType} onChange={(e) => setSourceType(e.target.value as 'file' | 'link')}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="file">File Upload</option>
                      <option value="link">Reference Link</option>
                    </select>
                  </div>
                )}
              </div>

              {(type === 'notice' || (type === 'resource' && sourceType === 'file')) ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {editing ? 'Replace File (optional)' : 'Choose Document File'}
                  </label>
                  <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    accept="application/pdf,image/png,image/jpeg,image/jpg,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <p className="text-xs text-slate-400 mt-1">Allowed formats: PDF, JPG, PNG, PPTX. Max size 15MB.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Reference Link URL</label>
                  <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} required placeholder="https://..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-slate-700">Visible to Public</span>
              </label>

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors min-h-[44px]">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors min-h-[44px]">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editing ? 'Update' : 'Upload & Save'}
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
            <h2 className="text-lg font-semibold text-slate-900">Delete Document?</h2>
            <p className="text-sm text-slate-500">This will remove &quot;{deleteTarget.title}&quot; from database and delete any stored files in Supabase bucket.</p>
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
