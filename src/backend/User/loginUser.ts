// backend/User/loginUser.ts
import admin from "firebase-admin";

// Firebase Admin SDK er allerede initialisert i createUser.ts
const auth = admin.auth();
const db = admin.firestore();

// Funksjon for å logge inn en bruker
export async function loginUser(user: { email: string; password: string }) {
  try {
    // Hent brukeren fra Firestore basert på e-post
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", user.email).get();

    if (snapshot.empty) {
      throw new Error("Bruker ikke funnet");
    }

    const userData = snapshot.docs[0].data();

    // Firebase Admin SDK støtter ikke passordverifisering direkte
    throw new Error("Passordverifisering må gjøres på klienten eller med Firebase Authentication SDK");

    return {
      uid: userData.uid,
      username: userData.username,
      email: userData.email,
    };
  } catch (error) {
    console.error("Feil ved innlogging:", error);
    throw new Error("Innlogging feilet");
  }
}
