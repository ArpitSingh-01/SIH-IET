'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Megaphone, CalendarDays, Clock, Users,
  Info, MessageCircle, Bell, ScrollText, LogOut, Menu, X, Wifi, WifiOff,
  ClipboardList, FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { AUTH_TOKEN_KEY } from '@/utils/constants';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Schedule', href: '/admin/schedule', icon: CalendarDays },
  { label: 'Timeline', href: '/admin/timeline', icon: Clock },
  { label: 'Forms Manager', href: '/admin/forms', icon: ClipboardList },
  { label: 'Documents Upload', href: '/admin/documents', icon: FileText },
  { label: 'Contacts', href: '/admin/contacts', icon: Users },
  { label: 'About SIH', href: '/admin/about', icon: Info },
  { label: 'WhatsApp', href: '/admin/whatsapp', icon: MessageCircle },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Activity Log', href: '/admin/activity', icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { mode } = useSystemHealth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fallback banner */}
      {mode === 'fallback' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <p className="text-sm text-amber-800 text-center">
            <WifiOff className="w-4 h-4 inline mr-1" />
            Backend unavailable. Admin writes are disabled. Content updates will resume when Render recovers.
          </p>
        </div>
      )}

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
        <span className="text-sm font-medium text-slate-700">SIH 2026 Admin</span>
        <div className="flex items-center gap-1">
          {mode === 'primary' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              <Wifi className="w-3 h-3" />Primary
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
              <WifiOff className="w-3 h-3" />Fallback
            </span>
          )}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden shadow-xl"
              initial={{ x: -264 }}
              animate={{ x: 0 }}
              exit={{ x: -264 }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200">
                <span className="text-sm font-semibold text-slate-900">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Close menu">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <nav className="p-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                        active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 w-full text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white border-r border-slate-200">
          <div className="h-16 flex items-center px-5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <img 
                src="/images/sih-logo.png" 
                alt="SIH Logo" 
                className="w-7 h-7 object-contain"
              />
              <span className="text-sm font-semibold text-slate-900">Admin Panel</span>
            </div>
            <div className="ml-auto">
              {mode === 'primary' ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <Wifi className="w-3 h-3" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                  <WifiOff className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                    active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 w-full text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
