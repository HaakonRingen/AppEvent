import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // trenger jeg client email her??
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

const firestore = getFirestore();


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, message } = body;

        if (!eventId || !message) {
            return NextResponse.json({ error: "Missing eventId or message" }, { status: 400 });
        }

        await firestore.collection("messagesFromHosts").add({
            message,
            event: `${eventId}`,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, message: "Message added" }, { status: 200 });
    } catch (error) {
        console.error("Error adding message:", error);
        return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
    }
}