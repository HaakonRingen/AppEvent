import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

const db = admin.firestore();

export async function POST(req: Request) {
    try {
        const { attendees } = await req.json();

        if (!attendees || attendees.length === 0) {
            return NextResponse.json({ names: [] });
        }

        // Henter brukernavnene fra Firestore
        const userPromises = attendees.map(async (userID) => {
            const userDoc = await db.collection("users").doc(userID).get();
            if (!userDoc.exists) return null; // Hvis brukeren ikke finnes, returner null

            const userData = userDoc.data();
            console.log(`Fetched data for user ${userID}:`, userData);
            return userData?.username ?? `Unknown (${userID})`; // Fallback hvis brukernavn mangler
        });

        // Fjerner `null`-verdier og sikrer at vi returnerer en liste med navn
        const usernames = (await Promise.all(userPromises))
            .filter((name): name is string => typeof name === "string");

        return NextResponse.json({ names: usernames });
    } catch (error) {
        console.error("Error fetching attendee names:", error);
        return NextResponse.json({ names: [], error: "Failed to fetch attendees" }, { status: 500 });
    }
}
