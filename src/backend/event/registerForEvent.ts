import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import * as admin from "firebase-admin"; // Makes it possible to administrate the firebase database

// Initialize Firebase Admin SDK
import serviceAccount from "../serviceAccountKey.json";

// Makes sure Firebase is not initialized several times
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount), 
    });
  }
  
// Gives access to the database
const db = admin.firestore();

// Function that allows a user to sign up for an event
export async function handleRegisterForEvent(userId: string, eventId: string): Promise<void> {
    try {
        console.log("A user is trying to sign up for an event");

        // Getting the references to the current user and the event the user is wanting to register for
        const eventRef = db.collection("events").doc(eventId);
        const userRef = db.collection("users").doc(userId);

        // Adding the user to the events attendees array
        await eventRef.update({
            attendees: admin.firestore.FieldValue.arrayUnion(userId),
        });

        // Adding the event to the users registeredEvents array
        await userRef.update({
            registeredEvents: admin.firestore.FieldValue.arrayUnion(eventId),
        });
    }
    catch (error) {
        console.error("Sign-up failed: ", error);
        throw new Error("Couldn't sign the user up");
    }  
};
