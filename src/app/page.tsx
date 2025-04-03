"use client";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Alert from "@/src/components/AlertProp";
import EventList from "../components/EventList";
import { auth } from "./firebase";
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";
import EventFilter from "../components/EventFilter";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  when: string;
  owner: string;
  isPrivate?: boolean;
  invitedUsers?: string[];
  attendees?: string[];
  category: string;
}

interface Category {
  date: string;
  place: string;
  type: string;
}

export default function Home() {
  const { user, setUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const { language } = useLanguage();
  const t = translations[language];
  const [showFilter, setShowFilter] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/getEvent");
      if (!res.ok) throw new Error("Failed to fetch events");
      let data: Event[] = await res.json();

      const userEmail = user?.firebaseUser?.email || "";
      const registeredEvents = user?.firestoreData?.registeredEvents || [];

      data = data.filter(
        (event) =>
          !event.isPrivate ||
          (user?.uid &&
            (event.owner === user.uid ||
              event.invitedUsers?.includes(userEmail) ||
              event.attendees?.includes(userEmail) ||
              registeredEvents.includes(event.id)))
      );

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [
    user?.uid,
    user?.firebaseUser?.email,
    user?.firestoreData?.registeredEvents?.join(","),
  ]);

  const handleSignUp = async (eventId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setMessage(t.loginRequired);
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      const res = await fetch("/api/registerForEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.uid, eventId }),
      });

      if (!res.ok) throw new Error(t.registrationError);

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              firestoreData: {
                ...prevUser.firestoreData,
                registeredEvents: [
                  ...(prevUser.firestoreData.registeredEvents || []),
                  eventId,
                ],
              },
            }
          : prevUser
      );

      fetchEvents();
      setMessage(t.registrationSuccess);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setMessage(t.registrationError);
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!user?.firebaseUser) {
      setMessage(t.loginRequired);
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      const token = await user.firebaseUser.getIdToken();
      const response = await fetch(`/api/deleteEvent?eventId=${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(t.deletionError);

      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      setMessage(t.deletionSuccess);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setMessage(t.deletionError);
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!user?.firebaseUser) {
      setMessage(t.loginRequired);
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    try {
      const token = await user.firebaseUser.getIdToken();
      await fetch("/api/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              firestoreData: {
                registeredEvents:
                  prevUser.firestoreData.registeredEvents?.filter(
                    (id) => id !== eventId
                  ) || [],
              },
            }
          : prevUser
      );

      fetchEvents();
      setMessage(t.unregistrationSuccess);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setMessage(t.unregistrationError);
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleAcceptInvitation = async (eventId: string) => {
    if (!user?.firebaseUser) return;

    try {
      const token = await user.firebaseUser.getIdToken();
      await fetch("/api/acceptInvitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, userEmail: user.firebaseUser.email }),
      });

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              firestoreData: {
                invitedEvents:
                  prevUser.firestoreData.invitedEvents?.filter(
                    (id) => id !== eventId
                  ) || [],
                registeredEvents: [
                  ...(prevUser.firestoreData.registeredEvents || []),
                  eventId,
                ],
              },
            }
          : prevUser
      );

      fetchEvents();
    } catch (error) {
      console.error(t.invitationAcceptError, error);
    }
  };

  const handleDeclineInvitation = async (eventId: string) => {
    if (!user?.firebaseUser) return;

    try {
      const token = await user.firebaseUser.getIdToken();
      await fetch("/api/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              firestoreData: {
                invitedEvents:
                  prevUser.firestoreData.invitedEvents?.filter(
                    (id) => id !== eventId
                  ) || [],
              },
            }
          : prevUser
      );

      fetchEvents();
    } catch (error) {
      console.error(t.invitationDeclineError, error);
    }
  };

  const [filters, setFilters] = useState({ date: "", place: "", category: "", search: "" });

  const handleFilterChange = (newFilters: { date: string; place: string; category: string; search: string }) => {
    setFilters(newFilters);
  };
  
  const filteredEvents = events.filter(event => {
    return (
      (!filters.date || event.when.startsWith(filters.date)) &&
      (!filters.place || event.location.toLowerCase().includes(filters.place.toLowerCase())) &&
      (!filters.category || event.category?.toLowerCase() === filters.category.toLowerCase()) &&
      (!filters.search || event.title.toLowerCase().includes(filters.search.toLowerCase()) || event.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });
  
  const userInterests = user?.firestoreData?.interests || [];
  const userLocation = user?.firestoreData?.location?.trim().toLowerCase() || ""

const recommendedEvents = filteredEvents.filter(event =>
  userInterests.includes(event.category) || 
  (event.location && event.location.trim().toLowerCase() === userLocation)
);

const otherEvents = filteredEvents.filter(event =>
  !userInterests.includes(event.category) &&
  (!event.location || event.location.trim().toLowerCase() !== userLocation)
);

  return (
    <div>
    {/* Hero-seksjon */}
    <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-r from-indigo-800 via-blue-800 to-cyan-500 text-white">
  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-white to-white bg-clip-text text-transparent drop-shadow-lg">
    {t.findYourNextEvent}</h1>
  <p className="mt-2 text-lg">
    {t.discoverEventsNextToYou}
  </p>
</div>
    <div className="flex flex-row space-x-6 p-4">
    {/* Left: Filter Button */}
    
    <div>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {t.filterEvents}
      </button>
      {showFilter && (
        <div className="absolute z-10 mt-2">
          <EventFilter onFilterChange={handleFilterChange} />
        </div>
      )}
    </div>


      {/* Right: Event List */}
      <div className="flex flex-col space-y-4 w-3/4">
       {recommendedEvents.length > 0 && (
        <EventList
          events={recommendedEvents}
          title={t.recommendedForYou || "Anbefalt for deg"}
          allowUnregister={true}
          user={user || undefined}
          handleUnregister={handleUnregister}
          handleRegister={handleSignUp}
          handleAccept={handleAcceptInvitation}
          handleDecline={handleDeclineInvitation}
          handleDelete={handleDelete}
        />
      )}

       {/* ✅ Other Events (Annet) */}
       <EventList
          events={otherEvents}
          title={t.otherEvents || "Annet"}
          allowUnregister={true}
          user={user || undefined}
          handleUnregister={handleUnregister}
          handleRegister={handleSignUp}
          handleAccept={handleAcceptInvitation}
          handleDecline={handleDeclineInvitation}
          handleDelete={handleDelete}
        />
      </div>

          {showAlert && (
            <Alert
              message={message}
              onClose={() => setShowAlert(false)}
              type={alertType}
            />
          )}
    </div>
    </div>
  );
}
