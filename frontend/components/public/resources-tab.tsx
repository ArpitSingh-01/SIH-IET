'use client';

import { motion } from 'framer-motion';
import { Presentation, FileText, Download, ExternalLink, BookOpen } from 'lucide-react';
import type { DocumentAsset } from '@/types';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as any } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface ResourcesTabProps {
  resources: DocumentAsset[];
}

export function ResourcesTab({ resources }: ResourcesTabProps) {
  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-500">No templates, guides, or rubrics available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-2">Student Resources &amp; Templates</h3>
        <p className="text-sm text-slate-500">
          Download official presentation templates, evaluation rubrics, guides, and guidelines prepared by the internal hackathon committee.
        </p>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {resources.map((resource) => {
          const isFile = !resource.link_url;
          const fileUrl = resource.file_url || '';
          const targetUrl = isFile ? fileUrl : (resource.link_url || '#');
          
          // Custom Icon determination
          const isPPT = targetUrl.toLowerCase().includes('.ppt') || targetUrl.toLowerCase().includes('.pptx');
          const isPDF = targetUrl.toLowerCase().includes('.pdf');

          let icon = <BookOpen className="w-5 h-5" />;
          let iconBg = 'bg-slate-50 text-slate-600';

          if (isPPT) {
            icon = <Presentation className="w-5 h-5" />;
            iconBg = 'bg-orange-50 text-orange-600';
          } else if (isPDF) {
            icon = <FileText className="w-5 h-5" />;
            iconBg = 'bg-red-50 text-red-600';
          } else if (!isFile) {
            icon = <BookOpen className="w-5 h-5" />;
            iconBg = 'bg-blue-50 text-blue-600';
          }

          return (
            <motion.div
              key={resource.id}
              variants={cardVariants}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {icon}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-base font-semibold text-slate-900 leading-snug truncate">
                      {resource.title}
                    </h4>
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-full">
                      {isFile ? (isPPT ? 'PPTX Template' : 'PDF Document') : 'Web Reference'}
                    </span>
                  </div>
                </div>
                {resource.description && (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {resource.description}
                  </p>
                )}
              </div>

              <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors min-h-[36px]"
                >
                  {isFile ? 'Download' : 'Visit Site'}
                  {isFile ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                </a>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

export function ResourcesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="h-5 w-48 bg-slate-200 rounded skeleton-shimmer" />
        <div className="h-4 w-full bg-slate-100 rounded skeleton-shimmer" />
      </div>
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
            <div className="h-4 w-full bg-slate-100 rounded skeleton-shimmer" />
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <div className="h-8 w-24 bg-slate-200 rounded-lg skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
