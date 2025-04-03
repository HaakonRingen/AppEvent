import { useEffect, useState, useCallback } from "react";

interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string; // "public" or "private"
  when: string;
  owner: string;
  invitedUsers?: string[];
  attendees?: string[];
  isPrivate?: boolean;
  category: string;
}

interface CustomUser {
  uid: string;
  firebaseUser: { email?: string | null };
  firestoreData: {
    aboutMe?: string;
    username?: string;
    registeredEvents?: string[];
    invitedEvents?: string[];
  };
}

const useEvents = (
  user: CustomUser | null,
  registeredEventIds: string[] | undefined,
  invitedEventIds: string[] | undefined
) => {
  const [futureEvents, setFutureEvents] = useState<EventType[]>([]);
  const [pastEvents, setPastEvents] = useState<EventType[]>([]);
  const [invitedEvents, setInvitedEvents] = useState<EventType[]>([]);
  const [publicEvents, setPublicEvents] = useState<EventType[]>([]);
  const [privateEvents, setPrivateEvents] = useState<EventType[]>([]);
  const [ownedEvents, setOwnedEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch("/api/getEvent");
      const allEvents: EventType[] = await res.json();

      const userEmail = user.firebaseUser?.email || "";
      const registeredEvents = user.firestoreData?.registeredEvents || [];

      // Events user is registered for
      const filteredRegisteredEvents = allEvents.filter(
        (event) => registeredEvents.includes(event.id) || event.attendees?.includes(userEmail)
      );

      // Events user is invited to
      const filteredInvitedEvents = allEvents.filter(
        (event) => event.invitedUsers?.includes(userEmail) && !registeredEvents.includes(event.id)
      );

      // ✅ NEW: Get all public events (including those the user is attending)
      const filteredPublicEvents = allEvents.filter(
        (event) => event.type === "public"
      );

      // ✅ NEW: Get all private events the user is attending
      const filteredPrivateEvents = allEvents.filter(
        (event) =>
          event.type === "private" &&
          (registeredEvents.includes(event.id) || event.invitedUsers?.includes(userEmail)) // ✅ Include invited users
      );

      // Fetch owned events
      const ownedEvents = allEvents.filter((event) => event.owner === user.uid);
      setOwnedEvents(ownedEvents);
      const now = new Date();
      setFutureEvents(filteredRegisteredEvents.filter((event) => new Date(event.when) > now));
      setPastEvents(filteredRegisteredEvents.filter((event) => new Date(event.when) <= now));
      setInvitedEvents(filteredInvitedEvents);
      setPublicEvents(filteredPublicEvents); // Now includes ALL public events
      setPrivateEvents(filteredPrivateEvents); // Stores private events the user attends
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }


    
  }, [user, registeredEventIds?.join(","), invitedEventIds?.join(","), user?.firebaseUser?.email]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { futureEvents, pastEvents, invitedEvents, ownedEvents, publicEvents, privateEvents, loading, refetchEvents: fetchEvents };
};

export default useEvents;
