// backend/createUser.ts
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const auth = admin.auth();
const db = admin.firestore();

// Function to create a user
export async function createUser(user: { username: string; email: string; password: string }) {
  try {
    const userRecord = await auth.createUser({
      email: user.email,
      password: user.password,
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      isAdmin: false,
    });

    await db.collection("users").doc(userRecord.uid).set({
      username: user.username,
      email: user.email,
      uid: userRecord.uid,
      isAdmin: false,
      registeredEvents: []
    });

    console.log("User created:", userRecord.uid);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}
