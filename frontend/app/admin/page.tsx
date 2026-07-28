'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Megaphone, CalendarDays, Clock, Users, Info, MessageCircle, Bell, Wifi, WifiOff, RefreshCw, Activity, Loader2 } from 'lucide-react';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useActivityLog } from '@/hooks/useActivityLog';
import { adminFetch, triggerWakeRender } from '@/services/api';
import { formatRelativeTime } from '@/utils/formatDate';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const { health, mode, refresh, loading: healthLoading } = useSystemHealth();
  const activity = useActivityLog();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [waking, setWaking] = useState(false);

  useEffect(() => {
    fetchStats();
    activity.fetchPage(0, 5);
  }, []);

  async function fetchStats() {
    try {
      const res = await adminFetch('/api/activity/stats');
      if (res.ok) setStats(await res.json());
    } catch {}
  }

  async function handleWake() {
    setWaking(true);
    await triggerWakeRender();
    setWaking(false);
    refresh();
  }

  const quickActions = [
    { label: 'New Announcement', href: '/admin/announcements', icon: Megaphone },
    { label: 'New Schedule Entry', href: '/admin/schedule', icon: CalendarDays },
    { label: 'Edit Timeline', href: '/admin/timeline', icon: Clock },
    { label: 'Edit Contacts', href: '/admin/contacts', icon: Users },
    { label: 'Edit About SIH', href: '/admin/about', icon: Info },
    { label: 'Edit WhatsApp', href: '/admin/whatsapp', icon: MessageCircle },
    { label: 'Send Notification', href: '/admin/notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Announcements', value: stats.announcements },
            { label: 'Schedule Entries', value: stats.schedule },
            { label: 'Timeline Entries', value: stats.timeline },
            { label: 'Contacts', value: stats.contacts },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* System Health */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">System Health</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Mode</span>
            {mode === 'primary' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <Wifi className="w-3 h-3" />Primary (Render Active)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                <WifiOff className="w-3 h-3" />Fallback
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Backend</span>
            <span className={`text-sm font-medium ${health?.backend ? 'text-green-700' : 'text-red-600'}`}>
              {health?.backend ? '✅ Online' : '❌ Offline'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Database</span>
            <span className={`text-sm font-medium ${health?.database ? 'text-green-700' : 'text-red-600'}`}>
              {health?.database ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">FCM</span>
            <span className={`text-sm font-medium ${health?.fcm ? 'text-green-700' : 'text-slate-400'}`}>
              {health?.fcm ? '✅ Active' : '⚠️ Not configured'}
            </span>
          </div>
          {health?.responseTime !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Response Time</span>
              <span className="text-sm font-medium text-slate-700">{health.responseTime}ms</span>
            </div>
          )}
          {health?.timestamp && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Last Check</span>
              <span className="text-sm text-slate-500">{formatRelativeTime(health.timestamp)}</span>
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleWake}
            disabled={waking}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors min-h-[44px]"
          >
            {waking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
            Wake Render
          </button>
          <button
            onClick={refresh}
            disabled={healthLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${healthLoading ? 'animate-spin' : ''}`} />
            Health Check
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all min-h-[44px]"
              >
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-medium text-slate-700 text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {activity.data.length === 0 ? (
            <p className="p-4 text-sm text-slate-400">No activity yet.</p>
          ) : (
            activity.data.map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                <Activity className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">
                    <span className="font-medium">{log.actor}</span>
                    {' '}{log.action.replace(/_/g, ' ')}
                  </p>
                  {log.detail && (
                    <p className="text-xs text-slate-400 truncate">{log.detail}</p>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {formatRelativeTime(log.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
