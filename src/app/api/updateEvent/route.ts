import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { editEvent } from "@/src/backend/event/editEvent";
import { storage } from "../../../backend/firebase-admin";
import { v4 as uuidv4 } from "uuid";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../../backend/serviceAccountKey.json")),
    //storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Ny linje lagt til
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    //Sjekk autentisering
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    //Hent eventId fra URL og valider at den finnes
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID mangler" }, { status: 400 });
    }

    // Hent formData fra request body
    const formData = await req.formData();
    const eventData = JSON.parse(formData.get("eventData") as string || "{}");

    if (!eventData || typeof eventData !== "object") {
      return NextResponse.json({ error: "Ugyldig eventData" }, { status: 400 });
    }

    //Sjekk at brukeren eier arrangementet
    const eventRef = admin.firestore().collection("events").doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
      return NextResponse.json({ error: "Eventet finnes ikke" }, { status: 404 });
    }

    const eventOwner = eventDoc.data()?.owner;
    if (eventOwner !== userId) {
      return NextResponse.json({ error: "Du har ikke tilgang til å redigere dette eventet" }, { status: 403 });
    }

    let imageUrl = eventData.imageUrl || "";

    if (formData.has("image")) {
      const imageFile = formData.get("image") as File;
      const bucket = storage;
      const fileName = `${uuidv4()}-${imageFile.name}`;
      const file = bucket.file(fileName);

      // Lagre bildet i Firebase Storage
      const buffer = await imageFile.arrayBuffer();
      await file.save(Buffer.from(buffer), {
        metadata: { contentType: imageFile.type },
      });

      await file.makePublic(); // Gjør bildet offentlig lesbart

      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
    }

    // Legg til bilde-URL i eventData
    const eventWithImage = { ...eventData, imageUrl };

    // Bruk `editEvent` for å oppdatere arrangementet
    await editEvent(eventId, eventWithImage);

    //Returner suksessrespons
    return NextResponse.json({ success: true, message: "Event oppdatert" }, { status: 200 });

  } catch (error) {
    console.error("Feil ved oppdatering av event:", error);
    return NextResponse.json({ error: "Intern serverfeil" }, { status: 500 });
  }
}
