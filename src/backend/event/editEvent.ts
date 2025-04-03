import * as admin from "firebase-admin"

//updates event

//fetches event from database
export async function editEvent(eventID: string, updateData: Record<string, any>): Promise<void> {
    const db = admin.firestore();
    const eventRef = db.collection("events").doc(eventID);

    const doc = await eventRef.get()
    if (!doc.exists){
        throw new Error(`Event med ID ${eventID} finnes ikke.`);
    }
    //awaits user input, and then updates the event and pushes it to database.
    await eventRef.update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
}

