'use client';

import { motion } from 'framer-motion';
import { Download, MessageCircle } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { LatestUpdateCard } from './latest-update-card';
import type { Announcement } from '@/types';

interface HeroSectionProps {
  latestAnnouncement: Announcement | null;
  whatsappEnabled: boolean;
  whatsappLink: string | null;
}

export function HeroSection({ latestAnnouncement, whatsappEnabled, whatsappLink }: HeroSectionProps) {
  const { canInstall, install } = useInstallPrompt();

  return (
    <section className="relative bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Logos */}
          <div className="flex items-center justify-center gap-6">
            <img 
              src="/images/sih-logo.png" 
              alt="Smart India Hackathon Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <div className="w-px h-12 bg-slate-300" />
            <img 
              src="/images/uni-logo.png" 
              alt="DDU Gorakhpur University Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
              SIH 2026 <span className="text-slate-400">|</span> IET DDUGU
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-500">
              Official Portal · IET, DDUGU
            </p>
          </div>

          {/* Latest Update Card */}
          {latestAnnouncement && (
            <div className="max-w-lg mx-auto">
              <LatestUpdateCard announcement={latestAnnouncement} />
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {canInstall && (
              <button
                onClick={install}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                Install App
              </button>
            )}
            {whatsappEnabled && whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                Join WhatsApp
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
