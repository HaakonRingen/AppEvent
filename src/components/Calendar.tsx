"use client";

import { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import useAuth from "../hooks/useAuth"; // Oppdatert sti
import useEvents from "../hooks/useEvents"; // Oppdatert sti
import BackButton from "./BackButton";
import EventModal from "./EventModal";
import Alert from "../components/AlertProp";
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  when: string;
  owner: string;
  isPrivate?: boolean;
  attendees?: string[];
  invitedUsers?: string[];

}

export default function Calendar() {
  const { user, setUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [registeredEventIds, setRegisteredEventIds] = useState(user?.firestoreData?.registeredEvents || []);
  const [invitedEventIds, setInvitedEventIds] = useState(user?.firestoreData?.invitedEvents || []);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const { futureEvents, pastEvents, privateEvents, invitedEvents, publicEvents, loading, refetchEvents } = useEvents(user, registeredEventIds, invitedEventIds);
  
  const { language } = useLanguage();
  const t = translations[language];
  const [filter, setFilter] = useState(t.all);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  useEffect(() => {
    setRegisteredEventIds(user?.firestoreData?.registeredEvents || []);
    setInvitedEventIds(user?.firestoreData?.invitedEvents || []);
  }, [user]);

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(startMonth);
  const endDate = endOfWeek(endMonth);

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

    const filterEvents = (events: EventType[]) => {
      const uniqueEvents = new Map<string, EventType>();
    
      events.forEach((event) => {
        const isRegistered = registeredEventIds.includes(event.id);
        const isPublic = event.type === "public" && isRegistered;
        const isPrivate = event.type === "private";
    
        if (filter === t.public && isPublic) uniqueEvents.set(event.id, event);
        if (filter === t.private && isPrivate) uniqueEvents.set(event.id, event);
        if (filter === t.all) uniqueEvents.set(event.id, event);
      });
    
      return Array.from(uniqueEvents.values());
    };
    

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleRegister = async (eventId: string) => {
    const currentUser = user?.firebaseUser;
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

      setUser(prevUser => prevUser ? {
        ...prevUser,
        firestoreData: {
          ...prevUser.firestoreData,
          registeredEvents: [...(prevUser.firestoreData.registeredEvents || []), eventId],
        }
      } : prevUser);

      refetchEvents();
      setMessage(t.registrationSuccess);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setMessage(t.registrationError);
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventId }),
      });

      setUser(prevUser => prevUser ? {
        ...prevUser,
        firestoreData: {
          ...prevUser.firestoreData,
          registeredEvents: prevUser.firestoreData.registeredEvents?.filter(id => id !== eventId) || [],
        }
      } : prevUser);

      refetchEvents();
      setMessage(t.unregistrationSuccess);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setMessage(t.unregistrationError);
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
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(t.deletionError);

      refetchEvents();
      setMessage(t.deletionSuccess);
      setAlertType("success");
      setShowAlert(true);
    } catch (error) {
      setMessage(t.deletionError);
      setAlertType("error");
      setShowAlert(true);
    }
  };

  const handleAccept = async (eventId: string) => {
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

      setUser(prevUser => prevUser ? {
        ...prevUser,
        firestoreData: {
          ...prevUser.firestoreData,
          invitedEvents: prevUser.firestoreData.invitedEvents?.filter(id => id !== eventId) || [],
          registeredEvents: [...(prevUser.firestoreData.registeredEvents || []), eventId],
        }
      } : prevUser);

      refetchEvents();
    } catch (error) {
      console.error(t.invitationAcceptError, error);
    }
  };

  const handleDecline = async (eventId: string) => {
    if (!user?.firebaseUser) return;

    try {
      const token = await user.firebaseUser.getIdToken();
      await fetch("/api/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventId }),
      });

      setUser(prevUser => prevUser ? {
        ...prevUser,
        firestoreData: {
          ...prevUser.firestoreData,
          invitedEvents: prevUser.firestoreData.invitedEvents?.filter(id => id !== eventId) || [],
        }
      } : prevUser);

      refetchEvents();
    } catch (error) {
      console.error(t.invitationDeclineError, error);
    }
  };

  const buttonColors: Record<string, string> = {
    [t.all]: "bg-blue-500",
    [t.public]: "bg-green-500",
    [t.private]: "bg-purple-500",
  };
  
  const eventColors: Record<string, string> = {
    [t.all]: "bg-gray-500", // Default for mixed events
    [t.public]: "bg-green-500",
    [t.private]: "bg-purple-500",
  };
  
  return (
    <div className="flex max-w-5xl mx-auto p-4">
      {/* Sidebar Filter */}
      <div className="w-1/4 p-4 border-r border-gray-300">
        <h3 className="font-bold text-lg mb-3">{t.filterOfEvents}</h3>
        {[t.all, t.public, t.private].map((type) => (
          <button
          key={type}
          onClick={() => setFilter(type)}
          className={`block w-full p-2 rounded mt-2 text-white ${buttonColors[type]} ${
            filter === type ? "border-2 border-black" : "opacity-70"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
        
        ))}
      </div>
  
      {/* Calendar */}
      <div className="w-3/4 p-4">
        <BackButton />
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="px-4 py-2 bg-gray-300 rounded">
            ⬅
          </button>
          <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="px-4 py-2 bg-gray-300 rounded">
            ➡
          </button>
        </div>
  
        <div className="grid grid-cols-7 gap-1 border border-gray-200">
          {t.days.map((day) => (
            <div key={day} className="p-2 text-center font-bold bg-pastel-turquoise">{day}</div>
          ))}
          {days.map((day) => (
            <div key={day.toString()} className={`p-2 w-24 h-24 border border-gray-200 relative flex flex-col ${isSameMonth(day, currentMonth) ? "bg-white" : "bg-gray-100"}`}>
              {isToday(day) && <span className="absolute top-1 right-1 w-4 h-4 bg-pastel-turquoise rounded-full"></span>}
              <span className="absolute top-1 right-1 text-xs font-semibold z-10">{format(day, "d")}</span>
              <div className="flex-grow"></div>
  
              <div className="mt-auto space-y-1">
                {filterEvents([...futureEvents, ...publicEvents, ...privateEvents])
                  .filter((event) => isSameDay(new Date(event.when).setHours(12), day))
                  .map((event, index) => {
                    const eventType = event.type === "private" ? t.private : t.public;
                    return (
                      <div
                        key={`${event.id}-${index}`}
                        className={`text-[10px] text-white rounded px-1 py-0.5 truncate cursor-pointer ${eventColors[eventType]}`}
                        onClick={() => handleEventClick(event)}
                      >
                        {event.title}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          user={user || undefined}
          handleUnregister={handleUnregister}
          handleRegister={handleRegister}
          handleDelete={handleDelete}
          handleAccept={handleAccept}
          handleDecline={handleDecline}
          closeModal={closeModal}
        />
      )}
      {showAlert && (
        <Alert
          message={message}
          onClose={() => setShowAlert(false)}
          type={alertType}
        />
      )}
    </div>
  );
}
