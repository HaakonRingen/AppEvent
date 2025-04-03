"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useEvents from "../../hooks/useEvents";
import TextField from "../../components/TextField";
import EventList from "../../components/EventList";
import BackButton from "../../components/BackButton";
import MessageList from "../../components/MessageList";
import translations, { getEventCategories } from "../../translations";
import { useLanguage } from "../../context/LanguageContext";

interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  when: string;
  owner: string;
  isPrivate?: boolean;
}

interface MessageType {
  id: string;
  event: string;
  message: string;
  eventTitle?: string;
}

const Profile = () => {
  const { user, setUser } = useAuth();
  const [registeredEventIds, setRegisteredEventIds] = useState(user?.firestoreData?.registeredEvents || []);
  const [invitedEventIds, setInvitedEventIds] = useState<string[]>(user?.firestoreData?.invitedEvents || []);
  const { futureEvents, pastEvents, invitedEvents, ownedEvents, loading, refetchEvents } = useEvents(user, registeredEventIds, invitedEventIds);
  const [aboutMe, setAboutMe] = useState(user?.firestoreData?.aboutMe || "");
  const [interests, setInterests] = useState<string[]>(user?.firestoreData?.interests|| []);
  const [location, setLocation] = useState(user?.firestoreData?.location || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<MessageType[]>([]);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const eventCategories = getEventCategories(language);

  useEffect(() => {
    if (user?.firestoreData?.aboutMe) {
      setAboutMe(user.firestoreData.aboutMe);
      setInterests(user.firestoreData.interests || []);
      setLocation(user.firestoreData.location || "");
    }
  }, [user]);

  useEffect(() => {
    setRegisteredEventIds(user?.firestoreData?.registeredEvents || []);
  }, [user]);

  useEffect(() => {
    setInvitedEventIds(user?.firestoreData?.invitedEvents || []);
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, registeredEventIds]);

  const fetchMessages = async () => {
    try {
      const [messagesRes, eventsRes] = await Promise.all([
        fetch("/api/fetchMessages", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        fetch("/api/getEvent", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!messagesRes.ok) throw new Error("Failed to fetch messages");
      if (!eventsRes.ok) throw new Error("Failed to fetch events");

      const messagesData = await messagesRes.json();
      const eventsData = await eventsRes.json();

      const eventsMap = eventsData.reduce((acc: { [x: string]: any; }, event: { id: string | number; title: any; }) => {
        acc[event.id] = event.title;
        return acc;
      }, {});

      const messagesWithTitles = messagesData.messages.map((message: { event: string | number; }) => ({
        ...message,
        eventTitle: eventsMap[message.event] || "Unknown Event",
      }));

      setMessages(messagesWithTitles);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const filterMessages = () => {
    const filtered = messages.filter(message => registeredEventIds.includes(message.event));
    setFilteredMessages(filtered);
  };

  const handleSave = async () => {
    if (!user?.firebaseUser) return;

    setSaving(true);
    try {
      const token = await user.firebaseUser.getIdToken();
      const res = await fetch("/api/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ aboutMe, interests, location }),
      });

      if (res.ok) {
        setUser((prevUser) =>
          prevUser
            ? { ...prevUser, firestoreData: { ...prevUser.firestoreData, aboutMe, interests } }
            : prevUser
        );
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (category: string) => {
    setInterests((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };


  const handleUnregister = async (eventId: string) => {
    if (!user?.firebaseUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const token = await user.firebaseUser.getIdToken();
      const res = await fetch("/api/unregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, userEmail: user.firebaseUser.email }),
      });

      if (!res.ok) throw new Error("Feil ved avmelding");

      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              firestoreData: {
                ...prevUser.firestoreData,
                registeredEvents: prevUser.firestoreData.registeredEvents?.filter((id) => id !== eventId) || [],
              },
            }
          : prevUser
      );

      refetchEvents();
    } catch (error) {
      console.error("Error unregistering from event:", error);
    }
  };

  if (!user) return <p>{t.pleaseLogin}</p>;

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
                ...prevUser.firestoreData,
                invitedEvents: prevUser.firestoreData.invitedEvents?.filter((id) => id !== eventId) || [],
                registeredEvents: [...(prevUser.firestoreData.registeredEvents || []), eventId],
              },
            }
          : prevUser
      );
      refetchEvents();
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  //edit event
  const handleEditEvent = (eventId: string) => {
    router.push(`/editEvent/${eventId}`);
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
                ...prevUser.firestoreData,
                invitedEvents: prevUser.firestoreData.invitedEvents?.filter((id) => id !== eventId) || [],
              },
            }
          : prevUser
      );
      refetchEvents();
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  if (!user) return <p>{t.pleaseLogin}</p>;

  return (
    <div className="max-w-screen-lg mx-auto">
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">{t.welcome}, {user.firestoreData.username || "Bruker"}</h1>

      {/* ABOUT ME SECTION */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t.aboutMe}</h2>
        {isEditing ? (
          <TextField
            placeholder={t.writeSomethingAboutYourself}
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)} 
            name=""
          />
        ) : (
          <p className="text-gray-600">{aboutMe || t.noInfoAdded}</p>
        )}

         {/* MINE INTERESSER (USER INTERESTS) */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2"> {t.myInterests}</h2>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-2">
            {eventCategories.map((category, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={interests.includes(category)}
                  onChange={() => toggleInterest(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            {interests.length > 0 ? interests.join(", ") : t.noInfoAdded}
          </p>
        )}
      </div>

      {/* STED (LOCATION) */}
<div className="mb-6">
  <h2 className="text-xl font-semibold mb-2">{t.place}</h2>
  {isEditing ? (
    <TextField
      placeholder="F.eks. Trondheim"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      name = "location"
    />
  ) : (
    <p className="text-gray-600">{location || t.notSpecified}</p>
  )}
</div>


        {/* EDIT / SAVE BUTTONS */}
        <div className="mt-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                disabled={saving}
              >
                {saving ? "Lagrer..." : t.save}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Avbryt
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {t.edit}
            </button>
          )}
        </div>
      </div>

      {/* MESSAGES SECTION */}
      <MessageList messages={filteredMessages} noMessagesText={t.noMessages} />

      {/* INVITATIONS */}
      <EventList
        events={invitedEvents}
        title={t.invitations}
        allowUnregister={false}
        user={user}
        setUser={setUser}
        refetchEvents={refetchEvents}
        handleAccept={handleAcceptInvitation}
        handleDecline={handleDeclineInvitation}
      />

      {/* UPCOMING EVENTS */}
      <EventList
        events={futureEvents.map(event => ({
          ...event,
          title: event.isPrivate ? `${event.title} (Privat)` : event.title
        }))}
        title={t.comingArrangements}
        allowUnregister={true}
        user={user}
        setUser={setUser}
        refetchEvents={refetchEvents}
        handleUnregister={handleUnregister}
      />

      {/* PAST EVENTS */}
      <EventList
        events={pastEvents}
        title={t.earlierArrangements}
        allowUnregister={false}
        user={user}
        setUser={setUser}
        refetchEvents={refetchEvents}
      />
      

      {/* OWNED EVENTS */}
      <EventList
        events={ownedEvents}
        title={t.myEvents}
        allowUnregister={false}
        user={user}
        setUser={setUser}
        refetchEvents={refetchEvents}
        handleEdit={handleEditEvent} // Sender redigeringsfunksjonen
      />
    </div>
  );
  
};

export default Profile;
