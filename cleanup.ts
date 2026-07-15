import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyCtdo_D42pcJqYKgzeyux63NnBRQjNPyXw",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "pt-bsm-d74f8.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "pt-bsm-d74f8",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "pt-bsm-d74f8.firebasestorage.app",
};

const app = initializeApp(config);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
      console.log("Usage: npx tsx cleanup.ts <admin_email> <admin_password>");
      process.exit(1);
  }

  console.log("Logging in...");
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Logged in successfully.");

  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  let count = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    // if it was created with Math.random, it starts with 'user_'
    if (docSnap.id.startsWith('user_')) {
      console.log('Deleting broken user:', docSnap.id, data.email);
      await deleteDoc(doc(db, 'users', docSnap.id));
      count++;
    }
  }
  console.log('Deleted', count, 'broken users.');
  process.exit(0);
}

run().catch(console.error);
