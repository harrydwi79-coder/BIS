const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// To run this script, you need to download a Service Account Key from Firebase Console
// (Project Settings -> Service Accounts -> Generate new private key)
// and set the path to it in the GOOGLE_APPLICATION_CREDENTIALS environment variable.
// Usage: node cleanup-orphaned-users.js

async function cleanupOrphanedUsers() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error("Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.");
    console.error("Please download your Firebase Service Account key and set this variable.");
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });

  const db = admin.firestore();
  const auth = admin.auth();

  console.log("Fetching all Firestore users...");
  const usersSnapshot = await db.collection('users').get();
  const firestoreUids = new Set(usersSnapshot.docs.map(doc => doc.id));
  
  console.log(`Found ${firestoreUids.size} users in Firestore.`);

  let pageToken;
  let orphanedCount = 0;

  do {
    const listUsersResult = await auth.listUsers(1000, pageToken);
    pageToken = listUsersResult.pageToken;

    for (const authUser of listUsersResult.users) {
      if (!firestoreUids.has(authUser.uid)) {
        console.log(`Deleting orphaned Auth user: ${authUser.uid} (${authUser.email})`);
        await auth.deleteUser(authUser.uid);
        orphanedCount++;
      }
    }
  } while (pageToken);

  console.log(`Cleanup complete. Deleted ${orphanedCount} orphaned Auth users.`);
}

cleanupOrphanedUsers().catch(console.error);
