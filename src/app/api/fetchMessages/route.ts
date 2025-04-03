import * as admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../../backend/serviceAccountKey.json")),
  });
}

const db = admin.firestore();

export async function GET(req: NextRequest) {
  try {
    const messagesSnapshot = await db.collection('messagesFromHosts').get();
    const messages = messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.error();
  }
}