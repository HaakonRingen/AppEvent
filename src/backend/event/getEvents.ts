import * as admin from "firebase-admin";

// Initalizing firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../serviceAccountKey.json")),
  });
}

const db = admin.firestore();


// Method that returns a string of eventIDs
export async function getEvents() {
  try {
    // Getting events from firebase
    console.log("Fetching events...");
    const eventsSnapshot = await db.collection("events").orderBy("createdAt", "desc").get();
    
    // Extracting the IDs of the events
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched events:", events);
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
