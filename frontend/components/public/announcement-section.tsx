'use client';

import { motion } from 'framer-motion';
import { AnnouncementCard } from './announcement-card';
import type { Announcement } from '@/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface AnnouncementSectionProps {
  announcements: Announcement[];
}

export function AnnouncementSection({ announcements }: AnnouncementSectionProps) {
  if (announcements.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Announcements</h2>
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {announcements.map((item) => (
            <AnnouncementCard key={item.id} announcement={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function AnnouncementSkeleton() {
  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-6 skeleton-shimmer" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-5 w-24 bg-slate-200 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-full skeleton-shimmer" />
              <div className="h-4 bg-slate-200 rounded w-3/4 skeleton-shimmer" />
              <div className="h-3 bg-slate-100 rounded w-1/3 mt-4 skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
