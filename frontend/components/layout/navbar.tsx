'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { requestNotificationPermission, getNotificationPermissionState, isNotificationSupported } from '@/utils/notifications';

export function Navbar() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    setSupported(isNotificationSupported());
    setPermission(getNotificationPermissionState());
  }, []);

  async function handleSubscribe() {
    setSubscribing(true);
    const success = await requestNotificationPermission();
    if (success) {
      setPermission('granted');
    }
    setSubscribing(false);
  }

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

          {supported && (
            <div className="flex items-center gap-2">
              {permission === 'default' && (
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 min-h-[36px]"
                  title="Enable Push Notifications"
                >
                  <Bell className="w-3.5 h-3.5 animate-bounce" />
                  Subscribe
                </button>
              )}
              {permission === 'granted' && (
                <span className="flex items-center gap-1 px-2.5 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg min-h-[36px]">
                  <Check className="w-3.5 h-3.5" />
                  Subscribed
                </span>
              )}
              {permission === 'denied' && (
                <span className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg min-h-[36px]" title="Notifications blocked in browser settings">
                  <BellOff className="w-3.5 h-3.5" />
                  Blocked
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
