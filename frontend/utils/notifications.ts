import { BACKEND_URL } from './constants';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return false;
  }

  // Check if firebase is configured in client
  const hasFirebase = 
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;

  let token = '';

  if (hasFirebase) {
    try {
      // Lazy import firebase to prevent bundle bloat or SSR errors
      const { initializeApp } = await import('firebase/app');
      const { getMessaging, getToken } = await import('firebase/messaging');

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      // Register FCM via Next PWA service worker
      const registration = await navigator.serviceWorker.ready;
      token = await getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
    } catch (err) {
      console.warn('Firebase registration failed, falling back to mock registration token:', err);
    }
  }

  // Fallback to generating a mock token for testing if firebase keys are empty or fail
  if (!token) {
    const randomBytes = Math.random().toString(36).substring(2, 15);
    token = `mock_token_${randomBytes}_${Date.now()}`;
  }

  // Send the token to the backend
  try {
    const res = await fetch(`${BACKEND_URL}/api/notifications/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to register token with backend:', err);
    return false;
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermissionState(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}
