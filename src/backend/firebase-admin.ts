import * as admin from "firebase-admin";
import { getStorage } from "firebase-admin/storage";
// Path to your service account key JSON file
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://appevent-6ac50-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: "appevent-6ac50.firebasestorage.app", 
  });
}

const db = admin.firestore(); // For Firestore
const authAdmin = admin.auth(); // For Firebase Authentication
const storage = getStorage().bucket("appevent-6ac50.firebasestorage.app"); // Firebase Storage

export { db, authAdmin, storage };