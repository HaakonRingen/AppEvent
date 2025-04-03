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
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
        }

        const commentsRef = firestore.collection("comments");
        const querySnapshot = await commentsRef.where("event", "==", `/events/${eventId}`).get();

        const comments = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
                const data = doc.data();

                let userName = "Unknown";
                if (data.user) {
                    const userPath = data.user; 
                    const userId = userPath.split("/").pop(); 
                    
                    if (userId) {
                        const userRef = await firestore.collection("users").doc(userId).get();
                        if (userRef.exists) {
                            userName = userRef.data()?.username || "Unknown";
                        }
                    }
                }

                return {
                    id: doc.id,
                    comment: data.comment,
                    user: userName,
                };
            })
        );

        return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
