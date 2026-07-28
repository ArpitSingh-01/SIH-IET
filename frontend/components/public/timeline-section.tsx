'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { formatEventDate } from '@/utils/formatDate';
import type { TimelineEntry } from '@/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
} as any;

interface TimelineSectionProps {
  entries: TimelineEntry[];
}

export function TimelineSection({ entries }: TimelineSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">Event Timeline</h2>
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-6">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                variants={itemVariants}
                className="relative pl-12 sm:pl-16"
              >
                {/* Dot */}
                <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm" />

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                  <h3 className="text-base font-semibold text-slate-900">
                    {entry.title}
                  </h3>
                  {entry.description && (
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {entry.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatEventDate(entry.event_date, entry.event_time)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function TimelineSkeleton() {
  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-44 bg-slate-200 rounded-lg mb-8 skeleton-shimmer" />
        <div className="relative">
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative pl-12 sm:pl-16">
                <div className="absolute left-2.5 sm:left-4.5 top-1.5 w-3 h-3 bg-slate-200 rounded-full" />
                <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                  <div className="h-5 w-40 bg-slate-200 rounded skeleton-shimmer" />
                  <div className="h-4 w-full bg-slate-100 rounded skeleton-shimmer" />
                  <div className="h-3 w-32 bg-slate-100 rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
