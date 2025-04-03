import { NextResponse } from "next/server";
import { handleRegisterForEvent } from "@/src/backend/event/registerForEvent"; // Importing backend method

export async function POST(req: Request) {
  try {
    // Getting userId, eventId from database
    const { userId, eventId } = await req.json();

    if (!userId || !eventId) {
      return NextResponse.json({ message: "Missing userId or eventId" });
    }

    // Using the backend method handleRegisterForEvent to register a user for an event
    await handleRegisterForEvent(userId, eventId);

    return NextResponse.json({ message: "Sign-up succeeded" });

  } catch (error) {
    console.error("Error during sign-up", error);
    return NextResponse.json({ message: "Something went wrong during sign-up" });
  }
}
