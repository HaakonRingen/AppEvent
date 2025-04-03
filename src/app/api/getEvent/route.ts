import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

import serviceAccount from "../../../backend/serviceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();

export async function GET() {
  try {
    const snapshot = await db.collection("events").get();
    const events = snapshot.docs.map((doc) => {
      const data = doc.data();
      
      if (data.when && data.when._seconds) {
        data.when = new Date(data.when._seconds * 1000).toISOString();  
      }

      return { id: doc.id, ...data };
    });

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}