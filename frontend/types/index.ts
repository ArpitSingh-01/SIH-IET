export interface Announcement {
  id: string;
  type: 'announcement' | 'schedule';
  message: string;
  pinned: boolean;
  urgent: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminAnnouncement extends Announcement {
  internal_name: string;
}

export interface TimelineEntry {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  display_order: number;
  visible: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  visible: boolean;
  display_order: number;
}

export interface SettingRow {
  key: string;
  value: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface HealthStatus {
  status: 'ok' | 'error' | 'degraded';
  backend: boolean;
  database: boolean;
  fcm: boolean;
  responseTime: number;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  detail: string | null;
  created_at: string;
}

export interface DashboardStats {
  announcements: number;
  schedule: number;
  timeline: number;
  contacts: number;
}

export interface GoogleFormLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  visible: boolean;
  display_order: number;
  created_at: string;
}

export interface DocumentAsset {
  id: string;
  title: string;
  description: string | null;
  type: 'notice' | 'resource';
  file_url: string | null;
  file_path: string | null;
  link_url: string | null;
  visible: boolean;
  display_order: number;
  created_at: string;
}
