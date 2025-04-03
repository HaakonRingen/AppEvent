import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

import serviceAccount from "../../../backend/serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const eventDoc = await db.collection("events").doc(eventId).get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const eventData = eventDoc.data();

    // Konverter Firestore timestamp til ISO format for "when" feltet
    if (eventData?.when && eventData.when._seconds) {
      eventData.when = new Date(eventData.when._seconds * 1000).toISOString();
    }

    return NextResponse.json(eventData, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}
