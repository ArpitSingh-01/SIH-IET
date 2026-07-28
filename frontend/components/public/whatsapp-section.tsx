'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface WhatsappSectionProps {
  enabled: boolean;
  link: string | null;
}

export function WhatsappSection({ enabled, link }: WhatsappSectionProps) {
  if (!enabled || !link) return null;

  return (
    <section className="py-10 sm:py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">Join Our WhatsApp Group</h2>
          <p className="text-sm text-slate-500 mb-6">
            Stay connected and get instant updates
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-5 h-5" />
            Join WhatsApp Group
          </a>
        </motion.div>
      </div>
    </section>
  );
}
