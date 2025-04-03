import { NextRequest, NextResponse } from 'next/server';
import * as admin from "firebase-admin";
import serviceAccount from "../../../backend/serviceAccountKey.json";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

const db = admin.firestore();

export async function POST(req: NextRequest) {
    const { eventId, email } = await req.json();
    if (!eventId || !email) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const eventRef = db.collection("events").doc(eventId);

        const userQuery = await db.collection("users").where("email", "==", email).get();
        if (!userQuery.empty) {
            const batch = db.batch();
            userQuery.forEach((doc) => {
                const userRef = db.collection("users").doc(doc.id);
                batch.update(userRef, {
                    invitedEvents: admin.firestore.FieldValue.arrayUnion(eventId),
                });
            });
            await batch.commit();
        } else {
            console.warn(`No user found with email: ${email}`);
            throw new Error('User not found');
        }

        await eventRef.update({
            invitedUsers: admin.firestore.FieldValue.arrayUnion(email),
        });

        return NextResponse.json({ message: 'User invited successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 });
    }
}