'use client';

import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import type { Contact } from '@/types';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
} as any;

interface ContactsSectionProps {
  contacts: Contact[];
}

export function ContactsSection({ contacts }: ContactsSectionProps) {
  if (contacts.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Committee Contacts</h2>
        <motion.div
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              variants={cardVariants}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
            >
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                {contact.name}
              </h3>
              <div className="space-y-2">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors min-h-[44px]"
                  >
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors min-h-[44px]"
                  >
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ContactsSkeleton() {
  return (
    <section className="py-10 sm:py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-52 bg-slate-200 rounded-lg mb-6 skeleton-shimmer" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded skeleton-shimmer" />
              <div className="h-4 w-36 bg-slate-100 rounded skeleton-shimmer" />
              <div className="h-4 w-40 bg-slate-100 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
