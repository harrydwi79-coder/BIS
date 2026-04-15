import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables or hardcoded fallback
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCtdo_D42pcJqYKgzeyux63NnBRQjNPyXw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pt-bsm-d74f8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pt-bsm-d74f8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pt-bsm-d74f8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "840538522258",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:840538522258:web:cca98f23b4fa4083c8dc4b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T2ZREFHLSV",
};

const app = initializeApp(config);
export const db = getFirestore(app, import.meta.env.VITE_FIRESTORE_DATABASE_ID || "(default)");
export const auth = getAuth(app);
