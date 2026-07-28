export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const AUTH_TOKEN_KEY = 'sih_admin_token';
export const BACKEND_TIMEOUT_MS = 5000;

export const NAV_LINKS = {
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Announcements', href: '/admin/announcements', icon: 'Megaphone' },
    { label: 'Schedule', href: '/admin/schedule', icon: 'CalendarDays' },
    { label: 'Timeline', href: '/admin/timeline', icon: 'Clock' },
    { label: 'Contacts', href: '/admin/contacts', icon: 'Users' },
    { label: 'About SIH', href: '/admin/about', icon: 'Info' },
    { label: 'WhatsApp', href: '/admin/whatsapp', icon: 'MessageCircle' },
    { label: 'Notifications', href: '/admin/notifications', icon: 'Bell' },
    { label: 'Activity Log', href: '/admin/activity', icon: 'ScrollText' },
  ],
} as const;
