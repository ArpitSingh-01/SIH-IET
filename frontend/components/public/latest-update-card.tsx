'use client';

import { Pin, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import type { Announcement } from '@/types';

interface LatestUpdateCardProps {
  announcement: Announcement;
}

export function LatestUpdateCard({ announcement }: LatestUpdateCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Latest Update
        </span>
        {announcement.urgent && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Urgent
          </span>
        )}
        {announcement.pinned && (
          <Pin className="w-3.5 h-3.5 text-amber-500" />
        )}
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">
        {announcement.message}
      </p>
      <p className="text-xs text-slate-400 mt-3">
        {formatDateTime(announcement.created_at)}
      </p>
    </div>
  );
}
