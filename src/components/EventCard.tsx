import React, { useState } from "react";
import UnregisterButton from "./UnregisterButton";
import RegisterButton from "./RegisterButton";
import DeleteButton from "./DeleteButton";
import EventMenu from "./EventMenu";
import Alert from "./AlertProp"; // Import Alert component
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

interface EventType {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  when: string;
  category: string;
  owner: string;
  isPrivate?: boolean;
  attendees?: string[];
  invitedUsers?: string[];
  imageUrl?: string;
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

interface EventCardProps {
  event: EventType;
  user?: UserType;
  allowUnregister?: boolean;
  attendees?: string[];
  handleUnregister?: (eventId: string) => void;
  handleRegister?: (eventId: string) => void;
  handleDelete?: (eventId: string) => void;
  handleEdit?: (eventId: string) => void; // Ny prop for redigering
  handleAccept?: (eventId: string) => Promise<void>;
  handleDecline?: (eventId: string) => Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  user,
  allowUnregister,
  attendees,
  handleUnregister,
  handleRegister,
  handleDelete,
  handleEdit, // Bruker redigeringsfunksjonen
  handleAccept,
  handleDecline,
}) => {
  const userEmail = user?.firebaseUser?.email || "";
  const isUserRegistered = user?.firestoreData?.registeredEvents?.includes(event.id);
  const isUserAttendee = event.attendees?.includes(userEmail);
  const isPrivateEvent = event.isPrivate;
  const isOwnerOrAdmin = user && (user.uid === event.owner || user.firestoreData?.isAdmin);
  const isInvited = user?.firestoreData?.invitedEvents?.includes(event.id);

  const { language } = useLanguage();
  const t = translations[language];

  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleReadMore = () => setShowFullDescription(!showFullDescription);

  return (
    <li className="p-4 border rounded-lg shadow flex flex-col justify-between relative w-[250px] max-w-[330px] flex-grow bg-gray-50">
      {/* Plasser EventMenu øverst til høyre og passer på at den ligger over bildet */}
      <div className="absolute top-2 right-0 z-5 flex items-center justify-between w-full px-4">
        <div className="">
          {isPrivateEvent ? (
            <p className="rounded bg-blue-100 pl-2 pr-2">Private</p>
          ) : (
            <p className="rounded bg-green-100 pl-2 pr-2">Public</p> 
          )}
        </div>
        <EventMenu 
          attendees={event.attendees || []}
          id={event.id}
          owner={event.owner}
          uid={user?.uid || ""}
          isPrivate={event.isPrivate || false} 
        />
      </div>
      {/* Legg til padding eller en spacer for å skyve bildet ned */}
      <div className="pt-7 flex-grow"> {/* Øker avstanden før bildet starter */}
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        ) : (
          <img 
            src="https://www.pallenz.co.nz/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png" 
            alt={event.title} 
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        )}
        <div>
          <h3 className="text-lg font-bold">{event.title}</h3>
          <p className="text-gray-600 flex-grow">
          {isExpanded ? event.description : `${event.description.substring(0, 100)}`}
          {event.description.length > 100 && (
             <>...
            <button onClick={toggleReadMore} className="text-blue-500 ml-1">
          {isExpanded ? t.showLess : t.readMore}
        </button>
        </>
      )}
    </p>
          <p><strong>{t.place}</strong> {event.location || t.unknown}</p>
          <p><strong>{t.category}</strong> {event.category || t.notSpecified}</p>
          <p><strong>{t.when}</strong> {new Date(event.when).toLocaleString("no-NO")}</p>
        </div>
      </div>

      <div className="flex flex-wrap space-x-2 mt-4 justify-center">
        {/* Viser meld av om allerede påmeldt */}
        {allowUnregister && handleUnregister && (isUserAttendee || isUserRegistered) ? (
          <UnregisterButton eventId={event.id} onUnregister={handleUnregister} />
        ) : (
          handleRegister && !isUserAttendee && !isUserRegistered && !isPrivateEvent && !isInvited && (
            <RegisterButton eventId={event.id} onRegister={handleRegister} />
          )
        )}

          {/* Slett-knapp for admin og eier */}
          {handleDelete && isOwnerOrAdmin && (
            <DeleteButton eventId={event.id} onDelete={handleDelete} />
          )}

          {/* Rediger-knapp for eieren av eventet */}
          {handleEdit && isOwnerOrAdmin && (
            <button
              onClick={() => handleEdit(event.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {t.editEvent}
            </button>
          )}

          {/* Aksepter/avslå invitasjon */}
          {handleAccept && handleDecline && isInvited && !isUserAttendee && !isUserRegistered && (
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleAccept(event.id)}
                className="bg-green-600 hover:bg-green-900 text-white px-4 py-2 mt-2 rounded"
              >
                {t.accept}
              </button>
              <button
                onClick={() => handleDecline(event.id)}
                className="bg-red-600 hover:bg-red-900 text-white px-4 py-2 mt-2 rounded"
              >
                {t.decline}
              </button>
            </div>
          )}
        </div>


      {/* Full description alert */}
        {showFullDescription && (
          <Alert
            message={event.description}
            onClose={() => setShowFullDescription(false)}
            type="info"
          />
        )}
      </li>
  );
};

export default EventCard;
