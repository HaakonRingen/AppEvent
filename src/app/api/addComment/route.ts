import { NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

const firestore = getFirestore();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, userId, comment } = body;

        if (!eventId || !userId || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await firestore.collection("comments").add({
            comment,
            event: `/events/${eventId}`,
            user: `/users/${userId}`,
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, message: "Comment added" }, { status: 200 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
    }
}
