"use client";
import React from "react";
import EventCard from "./EventCard";
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
  category: string;
  isPrivate?: boolean;
  attendees?: string[];
}

interface UserType {
  uid: string;
  firebaseUser: any;
  firestoreData: {
    aboutMe?: string;
    username?: string;
    registeredEvents?: string[];
    invitedEvents?: string[];
    isAdmin?: boolean;
  };
}

interface EventListProps {
  events: EventType[];
  title: string;
  allowUnregister?: boolean;
  user?: UserType;
  setUser?: React.Dispatch<React.SetStateAction<UserType | null>>;
  refetchEvents?: () => void;
  handleUnregister?: (eventId: string) => void;
  handleRegister?: (eventId: string) => void;
  handleDelete?: (eventId: string) => void;
  handleEdit?: (eventId: string) => void; // Ny prop for redigering
  handleAccept?: (eventId: string) => Promise<void>;
  handleDecline?: (eventId: string) => Promise<void>;
}


const EventList: React.FC<EventListProps> = ({
  events,
  title,
  allowUnregister,
  user,
  handleUnregister,
  handleRegister,
  handleDelete,
  handleEdit, // Legger til redigeringsfunksjon
  handleAccept,
  handleDecline,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="flex flex-col">
      <h2 className="text-3xl font-semibold mt-12 mb-8 ml-4">{title}</h2>
      {events.length > 0 ? (
        <ul className="flex flex-wrap gap-4 w-full">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
              allowUnregister={allowUnregister}
              attendees={event.attendees}
              handleUnregister={handleUnregister}
              handleRegister={handleRegister}
              handleDelete={handleDelete}
              handleEdit={handleEdit} // Sender redigeringsfunksjonen videre til EventCard
              handleAccept={handleAccept}
              handleDecline={handleDecline}
            />
          ))}
        </ul>
      ) : (
        <p>{t.no} {title.toLowerCase()}.</p>
      )}
    </div>
  );
};

export default EventList;