// editEvent.test.ts
import * as admin from "firebase-admin";
import { editEvent } from "./editEvent";


describe("editEvent", () => {
  let fakeDocRef: any;
  let fakeCollection: any;
  let fakeFirestore: any;

  beforeEach(() => {
    // Lag en falsk document reference med get- og update-metoder
    fakeDocRef = {
      get: jest.fn(),
      update: jest.fn(),
    };

    // Lag en falsk collection som returnerer vår fake document reference
    fakeCollection = {
      doc: jest.fn(() => fakeDocRef),
    };

    // Lag en falsk Firestore-instans
    fakeFirestore = {
      collection: jest.fn(() => fakeCollection),
    };

    // Overstyr admin.firestore()-kallet slik at det returnerer vårt fakeFirestore
    jest.spyOn(admin, "firestore").mockReturnValue(fakeFirestore as any);

    // Mock serverTimestamp slik at den returnerer en fast verdi (for eksempel "serverTimestamp")
    admin.firestore.FieldValue = {
      serverTimestamp: jest.fn(() => "serverTimestamp"),
    } as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("skal oppdatere et event dersom det finnes", async () => {
    // Sett opp falske data for et eksisterende event
    const fakeEventData  = {
      title: "Original Title",
      description: "Original Description",
      location: "Original Location",
      type: "Original Type",
      when: new Date("2023-01-01T00:00:00Z"),
    };

    // Konfigurer fakeDocRef.get() til å returnere et dokument som eksisterer
    fakeDocRef.get.mockResolvedValue({
      exists: true,
      data: () => fakeEventData,
    });

    // Dataen vi ønsker å oppdatere
    const updateData = {
      title: "Updated Title",
    };

    // Kall funksjonen
    await editEvent("test-event-id", updateData);

    // Verifiser at update() ble kalt med en kombinasjon av updateData og en updatedAt-verdi
    expect(fakeDocRef.update).toHaveBeenCalledWith({
      ...updateData,
      updatedAt: "serverTimestamp",
    });
  });

  it("skal kaste en feil dersom eventet ikke finnes", async () => {
    // Konfigurer fakeDocRef.get() til å returnere et dokument som ikke finnes
    fakeDocRef.get.mockResolvedValue({
      exists: false,
    });

    const updateData = {
      title: "Updated Title",
    };

    // Forvent at funksjonen kaster en feil når eventet ikke finnes
    await expect(editEvent("non-existent-id", updateData))
      .rejects
      .toThrowError("Event med ID non-existent-id finnes ikke.");
  });
});