import * as admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../../backend/serviceAccountKey.json")),
  });
}

const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    // Fetch all messages from the "messagesFromHost" collection
    const messagesQuerySnapshot = await db.collection("messagesFromHost").get();

    const messages = messagesQuerySnapshot.docs.map((doc) => doc.data());

    // Fetch event titles for all events
    // const eventDocs = await db.collection("events").get();
    // const eventTitles = eventDocs.docs.map((doc) => ({
    //   eventId: doc.id,
    //   title: doc.data()?.title || null,
    // }));

    // // Map messages to include event titles
    // const messagesWithTitles = messages.map((message) => {
    //   const eventTitle = eventTitles.find((event) => event.eventId === message.eventID)?.title;
    //   return { ...message, eventTitle };
    // });

    return NextResponse.json({ messages: messages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}