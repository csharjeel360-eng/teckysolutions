// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Use Vite env vars (must be prefixed with VITE_). Provide sensible
// fallbacks so local dev works if .env isn't configured yet.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC6pm0QhwmOle-H6Kdj4xYsx-7OT7KQSP4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ecommerce-7f20f.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ecommerce-7f20f',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ecommerce-7f20f.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '339146255474',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:339146255474:web:a9d33fa236c95fa1c966eb',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-Z21CBB5YGM'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and set persistence to local
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  // eslint-disable-next-line no-console
  console.warn('Failed to set Firebase auth persistence:', err?.message || err);
});

// Firestore reference
export const db = getFirestore(app);

// Initialize analytics if supported (fail silently in non-browser envs)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (err) {
  // ignore
}

export { analytics };
export default app;