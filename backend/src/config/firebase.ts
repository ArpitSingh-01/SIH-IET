import * as admin from 'firebase-admin';
import { env } from './env';

let firebaseInitialized = false;

export function initializeFirebase(): void {
  if (firebaseInitialized) return;

  if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.warn('Firebase service account not configured. Push notifications disabled.');
    return;
  }

  try {
    const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log('Firebase Admin SDK initialized');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
}

export function isFirebaseReady(): boolean {
  return firebaseInitialized;
}
