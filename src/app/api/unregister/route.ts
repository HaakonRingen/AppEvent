import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../../backend/serviceAccountKey.json")),
  });
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { eventId, userEmail } = await req.json();
    if (!eventId) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const userRef = admin.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userData.registeredEvents) {
      return NextResponse.json({ error: "No registered events found" }, { status: 400 });
    }

    const updatedEvents = userData.registeredEvents.filter((id: string) => id !== eventId);
    await userRef.update({ 
      registeredEvents: updatedEvents,
      invitedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
    });

    const eventRef = admin.firestore().collection("events").doc(eventId);
    await eventRef.update({
      attendees: admin.firestore.FieldValue.arrayRemove(userData.uid),
      invitedUsers: admin.firestore.FieldValue.arrayRemove(userData.email),
    });
    

    return NextResponse.json({ success: true, registeredEvents: updatedEvents });
  } catch (error) {
    console.error("Error unregistering from event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
