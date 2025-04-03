import { NextResponse } from 'next/server';
import { authAdmin } from '../../../backend/firebase-admin';  // Import Firebase Admin SDK
import { db } from '../../../backend/firebase-admin';  // Import Firestore

// Named export for DELETE request
export async function DELETE(req: Request) {
  console.log("kjører handler");

  try {
    console.log("inni try-blokka");
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID missing' }, { status: 400 });
    }

    // Hent autentiseringstokenet fra forespørselens headers
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 401 });
    }

    // Verifiser tokenet og hent brukerens UID
    const decodedToken = await authAdmin.verifyIdToken(token);
    const userId = decodedToken.uid;
    console.log(`User ID: ${userId}`);

    // Hent brukerens dokument fra Firestore for å sjekke om de er admin
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const isAdmin = userData?.isAdmin || false;
    console.log(`Is Admin: ${isAdmin}`);

    // Hent arrangementet fra Firestore
    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventData = eventDoc.data();
    console.log(`Event Data: ${JSON.stringify(eventData)}`);

    // Sjekk om brukeren er admin eller eier av arrangementet
    if (eventData?.owner !== userId && !isAdmin) {
      console.log(`User not authorized: ${userId}`);
      return NextResponse.json({ error: 'User not authorized to delete this event' }, { status: 403 });
    }

    // Slett arrangementet
    await eventRef.delete();
    console.log("Arrangement slettet med ID:", eventId);
    return NextResponse.json({ message: 'Event deleted!' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}