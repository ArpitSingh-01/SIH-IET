'use client';

import { WifiOff, RotateCcw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center space-y-6 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <WifiOff className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-slate-900">You are offline</h1>
          <p className="text-sm text-slate-500">
            Please check your internet connection. Some sections of SIH 2026 IET DDUGU portal may be unavailable.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
      </div>
    </div>
  );
}
