'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Pin } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import type { Announcement } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
} as any;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface ScheduleSectionProps {
  scheduleEntries: Announcement[];
}

export function ScheduleSection({ scheduleEntries }: ScheduleSectionProps) {
  if (scheduleEntries.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Schedule</h2>
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {scheduleEntries.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Schedule
                </span>
                {item.urgent && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Urgent
                  </span>
                )}
                {item.pinned && (
                  <Pin className="w-3.5 h-3.5 text-amber-500 ml-auto flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {item.message}
              </p>
              <p className="text-xs text-slate-400 mt-3">
                {formatDateTime(item.created_at)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ScheduleSkeleton() {
  return (
    <section className="py-10 sm:py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-36 bg-slate-200 rounded-lg mb-6 skeleton-shimmer" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="h-5 w-20 bg-emerald-100 rounded-full skeleton-shimmer" />
              <div className="h-4 bg-slate-200 rounded w-full skeleton-shimmer" />
              <div className="h-4 bg-slate-200 rounded w-2/3 skeleton-shimmer" />
              <div className="h-3 bg-slate-100 rounded w-1/4 skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
