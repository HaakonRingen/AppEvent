import React from "react";
import UnregisterButton from "./UnregisterButton";
import RegisterButton from "./RegisterButton";
import DeleteButton from "./DeleteButton";
import { useLanguage } from "../context/LanguageContext";
import translations from "../translations";

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

interface EventModalProps {
  event: EventType;
  user?: UserType;
  handleUnregister?: (eventId: string) => void;
  handleRegister?: (eventId: string) => void;
  handleDelete?: (eventId: string) => void;
  handleAccept?: (eventId: string) => Promise<void>;
  handleDecline?: (eventId: string) => Promise<void>;
  closeModal: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  user,
  handleUnregister,
  handleRegister,
  handleDelete,
  handleAccept,
  handleDecline,
  closeModal,
}) => {
  const userEmail = user?.firebaseUser?.email || "";
  const isUserRegistered = user?.firestoreData?.registeredEvents?.includes(event.id);
  const isUserAttendee = event.attendees?.includes(userEmail);
  const isPrivateEvent = event.isPrivate;
  const isOwnerOrAdmin = user && (user.uid === event.owner || user.firestoreData?.isAdmin);

  const eventDate = new Date(event.when);
  const isFutureEvent = eventDate > new Date();

  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-4 rounded shadow-lg max-w-md w-full relative">
      <button onClick={closeModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        &times;
      </button>
      <h2 className="text-xl font-bold mb-2">{event.title}</h2>
      <p><strong>{t.description}:</strong> {event.description}</p>
      <p><strong>{t.place}:</strong> {event.location}</p>
      <p><strong>{t.type}:</strong> {event.type}</p>
      <p><strong>{t.when}:</strong> {new Date(event.when).toLocaleString("no-NO")}</p>

      {isFutureEvent && (
      <div className="flex space-x-2 mt-4 justify-center">
        {/* Viser meld av om allerede påmeldt  */}
        {handleUnregister && (isUserAttendee || isUserRegistered) ? (
          <UnregisterButton eventId={event.id} onUnregister={handleUnregister} />
        ) : (
          handleRegister && !isUserAttendee && !isUserRegistered && !isPrivateEvent && (
            <RegisterButton eventId={event.id} onRegister={handleRegister} />
          )
        )}

        {/* Viser slett for admin og eier */}
        {handleDelete && isOwnerOrAdmin && (
          <DeleteButton eventId={event.id} onDelete={handleDelete} />
        )}

        {/* Viser aksepter/avslå om det er private, man er invitert, og man ikke har akseptert allerede */}
        {handleAccept && handleDecline && isPrivateEvent && user?.firestoreData?.invitedEvents?.includes(event.id) && !isUserAttendee && (
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleAccept(event.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {t.accept}
            </button>
            <button
              onClick={() => handleDecline(event.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              {t.decline}
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  </div>
  );
};

export default EventModal;