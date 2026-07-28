'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Calendar } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import type { GoogleFormLink } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as any } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface FormsTabProps {
  forms: GoogleFormLink[];
}

export function FormsTab({ forms }: FormsTabProps) {
  if (forms.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">No active registration or feedback forms available.</p>
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
      {forms.map((form) => (
        <motion.div
          key={form.id}
          variants={cardVariants}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                {form.title}
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-medium rounded-full flex-shrink-0">
                Active Form
              </span>
            </div>
            {form.description && (
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {form.description}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateTime(form.created_at)}
            </span>
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors min-h-[36px]"
            >
              Fill Form
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function FormsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 w-40 bg-slate-200 rounded skeleton-shimmer" />
            <div className="h-4 w-16 bg-slate-100 rounded-full skeleton-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-100 rounded skeleton-shimmer" />
            <div className="h-4 w-3/4 bg-slate-100 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="h-3 w-24 bg-slate-100 rounded skeleton-shimmer" />
            <div className="h-8 w-24 bg-slate-200 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
