'use client';

import { motion } from 'framer-motion';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import type { DocumentAsset } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as any } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface NoticesTabProps {
  notices: DocumentAsset[];
}

export function NoticesTab({ notices }: NoticesTabProps) {
  if (notices.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">No official notices or document records available.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {notices.map((notice) => {
        const isExternal = !!notice.link_url;
        const targetUrl = notice.file_url || notice.link_url || '#';

        return (
          <motion.div
            key={notice.id}
            variants={cardVariants}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug truncate">
                    {notice.title}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-medium rounded-full">
                    {isExternal ? 'Reference Link' : 'Official PDF'}
                  </span>
                </div>
              </div>
              {notice.description && (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {notice.description}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateTime(notice.created_at)}
              </span>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors min-h-[36px]"
              >
                {isExternal ? 'View Link' : 'Download File'}
                {isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              </a>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function NoticesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl skeleton-shimmer flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 bg-slate-200 rounded skeleton-shimmer" />
              <div className="h-4 w-20 bg-slate-100 rounded-full skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded skeleton-shimmer" />
            <div className="h-4 w-5/6 bg-slate-100 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="h-3 w-24 bg-slate-100 rounded skeleton-shimmer" />
            <div className="h-8 w-28 bg-slate-200 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
