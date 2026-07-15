import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCtdo_D42pcJqYKgzeyux63NnBRQjNPyXw",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "pt-bsm-d74f8.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "pt-bsm-d74f8",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "pt-bsm-d74f8.firebasestorage.app",
};

const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  for (const docSnap of snapshot.docs) {
    console.log(docSnap.data().email, docSnap.data().role);
  }
  process.exit(0);
}

run().catch(console.error);
