import { NextResponse } from "next/server";
import { createEvent } from "../../../backend/event/createEvent"; // Import from the backend folder
import { getFirestore } from "firebase-admin/firestore";
import { storage } from "../../../backend/firebase-admin";
import { v4 as uuidv4 } from "uuid";


const db = getFirestore();


export const config = {
  api: {
    bodyParser: false,
  },
};

// Named export for POST request
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const eventData = JSON.parse(formData.get("eventData") as string || "{}");

    let imageUrl = "";

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

    // Opprett event i Firestore
    await createEvent(eventWithImage);

    console.log("backend 200");
    return NextResponse.json({ message: "Event created!" }, { status: 200 });

  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
