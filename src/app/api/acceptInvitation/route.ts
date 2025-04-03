import * as admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../../backend/serviceAccountKey.json")),
  });
}

const db = admin.firestore();

// Named export for POST request (Required for Next.js App Router API routes)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, userEmail } = body;

    if (!eventId || !userEmail) {
      return NextResponse.json({ error: "Missing eventId or userEmail" }, { status: 400 });
    }

    // Fetch the user data based on the email
    const userQuerySnapshot = await db.collection("users").where("email", "==", userEmail).get();
    if (userQuerySnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userQuerySnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    const eventRef = db.collection("events").doc(eventId);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eventData = eventSnap.data() || {};

    // Ensure the fields exist
    const updatedInvitedUsers = (eventData.invitedUsers || []).filter((email: string) => email !== userEmail);
    const updatedAttendees = Array.from(new Set([...(eventData.attendees || []), userId]));

    await eventRef.update({
      invitedUsers: updatedInvitedUsers,
      attendees: updatedAttendees,
    });

    // Update the user's registeredEvents and invitedEvents fields
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      registeredEvents: admin.firestore.FieldValue.arrayUnion(eventId),
      invitedEvents: admin.firestore.FieldValue.arrayRemove(eventId),
    });

    const updatedEventSnap = await eventRef.get();
    const updatedEventData = updatedEventSnap.data();

    return NextResponse.json({ message: "Invitation accepted", updatedEvent: updatedEventData }, { status: 200 });

  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
