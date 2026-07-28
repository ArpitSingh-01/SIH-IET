'use client';

import { useState, useEffect } from 'react';
import { ScrollText, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useActivityLog } from '@/hooks/useActivityLog';
import { formatDateTime } from '@/utils/formatDate';

export default function AdminActivityPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const activity = useActivityLog();

  useEffect(() => {
    const offset = (page - 1) * limit;
    activity.fetchPage(offset, limit);
  }, [page]);

  const totalPages = Math.ceil(activity.total / limit) || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Activity Log</h1>
        <span className="text-xs text-slate-500 font-medium bg-white px-3 py-1.5 border border-slate-200 rounded-lg shadow-sm">
          Total Entries: {activity.total}
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activity.loading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 skeleton-shimmer h-14" />
            ))}
          </div>
        ) : activity.data.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No activity logged yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actor
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Detail
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activity.data.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-slate-900">
                        {log.actor}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-700">
                        <span className="inline-flex items-center gap-1.5 capitalize">
                          <Activity className="w-3.5 h-3.5 text-slate-400" />
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-500 max-w-xs truncate">
                        {log.detail || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-h-[36px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <span className="text-xs font-medium text-slate-600">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-h-[36px]"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
