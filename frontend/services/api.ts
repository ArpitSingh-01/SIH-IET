import { createClient } from '@supabase/supabase-js';
import { BACKEND_URL, SUPABASE_URL, SUPABASE_ANON_KEY, BACKEND_TIMEOUT_MS } from '@/utils/constants';
import type { Announcement, TimelineEntry, Contact, SettingRow, HealthStatus, GoogleFormLink, DocumentAsset } from '@/types';

let supabasePublicClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabasePublicClient) {
    const url = SUPABASE_URL || 'https://placeholder.supabase.co';
    const anonKey = SUPABASE_ANON_KEY || 'placeholder';
    supabasePublicClient = createClient(url, anonKey);
  }
  return supabasePublicClient;
}

// Module-scope failover state
let renderFailedAt: number | null = null;
let wakeAttemptInProgress = false;

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Public Read Functions (with failover) ────────────────────────

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/announcements`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('announcements')
      .select('id, type, message, pinned, urgent, published, created_at, updated_at')
      .eq('type', 'announcement')
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Announcement[]) || [];
  }
}

export async function fetchSchedule(): Promise<Announcement[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/schedule`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('announcements')
      .select('id, type, message, pinned, urgent, published, created_at, updated_at')
      .eq('type', 'schedule')
      .eq('published', true)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as Announcement[]) || [];
  }
}

export async function fetchTimeline(): Promise<TimelineEntry[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/timeline`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('timeline')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data as TimelineEntry[]) || [];
  }
}

export async function fetchContacts(): Promise<Contact[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/contacts`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('contacts')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data as Contact[]) || [];
  }
}

export async function fetchSetting(key: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/settings/${key}`);
    if (!res.ok) throw new Error('Backend error');
    const data: SettingRow = await res.json();
    renderFailedAt = null;
    return data.value;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) throw error;
    return (data as any)?.value || null;
  }
}

export async function fetchAllPublicAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/announcements`);
    const scheduleRes = await fetchWithTimeout(`${BACKEND_URL}/api/schedule`);
    if (!res.ok || !scheduleRes.ok) throw new Error('Backend error');
    const announcements = await res.json();
    const schedule = await scheduleRes.json();
    renderFailedAt = null;
    return [...announcements, ...schedule];
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('announcements')
      .select('id, type, message, pinned, urgent, published, created_at, updated_at')
      .eq('published', true)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Announcement[]) || [];
  }
}

export async function fetchGoogleForms(): Promise<GoogleFormLink[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/forms`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('google_forms')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data as GoogleFormLink[]) || [];
  }
}

export async function fetchDocuments(type: 'notice' | 'resource'): Promise<DocumentAsset[]> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/api/documents/${type}`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    triggerWakeRender();

    const { data, error } = await getSupabase()
      .from('documents')
      .select('*')
      .eq('type', type)
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as DocumentAsset[]) || [];
  }
}

// ─── Health Check ─────────────────────────────────────────────────

export async function fetchHealthStatus(): Promise<HealthStatus> {
  try {
    const res = await fetchWithTimeout(`${BACKEND_URL}/health`);
    if (!res.ok) throw new Error('Backend error');
    const data = await res.json();
    renderFailedAt = null;
    return data;
  } catch {
    if (!renderFailedAt) renderFailedAt = Date.now();
    return {
      status: 'error',
      backend: false,
      database: false,
      fcm: false,
      responseTime: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── Wake Render ──────────────────────────────────────────────────

export async function triggerWakeRender(
  onProgress?: (attempt: number, maxAttempts: number) => void
): Promise<boolean> {
  if (wakeAttemptInProgress) return false;
  wakeAttemptInProgress = true;
  const maxAttempts = 5;

  for (let i = 1; i <= maxAttempts; i++) {
    onProgress?.(i, maxAttempts);
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/health`);
      if (res.ok) {
        renderFailedAt = null;
        wakeAttemptInProgress = false;
        return true;
      }
    } catch {
      // Continue trying
    }
    if (i < maxAttempts) {
      await new Promise((r) => setTimeout(r, 15000));
    }
  }

  wakeAttemptInProgress = false;
  return false;
}

export function isRenderDown(): boolean {
  return renderFailedAt !== null;
}

// ─── Admin API Calls (always go through Render) ───────────────────

export async function adminFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sih_admin_token') : null;

  const res = await fetchWithTimeout(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sih_admin_token');
      window.location.href = '/login?expired=true';
    }
    throw new Error('Session expired');
  }

  return res;
}
