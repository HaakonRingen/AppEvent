import * as admin from "firebase-admin"; // Makes it possible to administrate the firebase database

// Initialize Firebase Admin SDK
import serviceAccount from "../serviceAccountKey.json";

// Makes sure Firebase is not initialized several times
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount), 
    });
  }
  
// Grants access to the database
const db = admin.firestore();

// Interface for an event
interface Event {
    title: string;
    description: string;
    location: string;
    type: string;
    when: string;
    owner: string;
    attendees?: string[];
    invitedUsers?: string[]; 
    isPrivate?: boolean;
    imageUrl?: string;
    category: string;
}

// Function to create event
export async function createEvent(event: Event): Promise<void> {
    try {
        console.log(`Trying to create event: ${event.title}`);

        const eventRef = await db.collection("events").add({
            title: event.title,
            description: event.description,
            location: event.location,
            type: event.type,
            when: event.when,
            attendees: [],
            invitedUsers: event.invitedUsers || [], 
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // trenger vi denne?
            owner: event.owner,
            isPrivate: event.isPrivate || false,
            imageUrl: event.imageUrl || "",
            category: event.category || "Unknown"
        });

        console.log("Arrangement opprettet med ID:", eventRef.id);

        if (event.invitedUsers && event.invitedUsers.length > 0) {
            const batch = db.batch();
            
            for (const email of event.invitedUsers) {
                const userQuery = await db.collection("users").where("email", "==", email).get();
        
                if (!userQuery.empty) {
                    userQuery.forEach((doc) => {
                        const userRef = db.collection("users").doc(doc.id);
                        batch.update(userRef, {
                            invitedEvents: admin.firestore.FieldValue.arrayUnion(eventRef.id),
                        });
                    });
                } else {
                    console.warn(`No user found with email: ${email}`);
                }
            }
        
            await batch.commit();
        }
             
    } catch (error) {
        console.error ("Kunne ikke opprette arrangement", error);
        throw error;
    }
}
