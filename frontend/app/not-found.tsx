'use client';

import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
          <p className="text-sm text-slate-500">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </Link>
      </div>
    </div>
  );
}
