'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img 
                src="/images/sih-logo.png" 
                alt="SIH Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-semibold text-slate-900 text-lg tracking-tight">
                SIH 2026 <span className="text-slate-400">|</span> IET DDUGU
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
