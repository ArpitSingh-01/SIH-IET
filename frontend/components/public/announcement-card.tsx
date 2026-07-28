'use client';

import { motion } from 'framer-motion';
import { Pin, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import type { Announcement } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
} as any;

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          Announcement
        </span>
        {announcement.urgent && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Urgent
          </span>
        )}
        {announcement.pinned && (
          <Pin className="w-3.5 h-3.5 text-amber-500 ml-auto flex-shrink-0" />
        )}
      </div>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {announcement.message}
      </p>
      <p className="text-xs text-slate-400 mt-3">
        {formatDateTime(announcement.created_at)}
      </p>
    </motion.div>
  );
}
