'use client';

import { motion } from 'framer-motion';

interface AboutSectionProps {
  content: string | null;
}

export function AboutSection({ content }: AboutSectionProps) {
  if (!content) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">About SIH</h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
