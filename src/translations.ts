import { ReadMore } from "@mui/icons-material";
import { write } from "fs";
import { register } from "module";
import { Mynerve } from "next/font/google";
import { send, title } from "process";

const translations = {
    no: {
      welcome: "Velkommen",
      register: "Registrer",
      login: "Logg inn",
      logout: "Logg ut",
      myCalendar: "Min kalender",
      addEvent: "Legg til arrangement",
      myProfile: "Min side",
      loginToCreateEvent: "Logg inn for å opprette arrangement",
      unregister: "Meld av",
      createEvent: "Opprett arrangement",
      delete: "Slett",
      findYourEvents: "Finn ditt neste arrangement",
      save: "Lagre",
      saving: "Lagrer...",
      cancel: "Avbryt",
      edit: "Rediger",
      aboutMe: "Om meg",
      noInfoAdded: "Ingen informasjon lagt til.",
      writeSomethingAboutYourself: "Skriv noe om deg selv...",
      filterOfEvents: "Filtrer hendelser",
      all: "Alle",
      public: "Offentlig",
      private: "Privat",
      no: "Ingen",
      registered: "Påmeldt",
      invitations: "Invitasjoner",
      back: "Tilbake",
      accept: "Aksepter",
      decline: "Avslå",
      noEvents: "Ingen hendelser.",
      close: "Lukk",
      success: "Suksess",
      error: "Feil",
      findYourNextEvent: "Finn ditt neste arrangement",
      join: "Meld på",
      description: "Beskrivelse",
      place: "Sted",
      type: "Type",
      date: "Dato",
      when: "Når",
      nobody: "Ingen",
      unknown: "Ukjent",
      notSpecified: "Ikke spesifisert",
      days: ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"],
      arrangements: "Arrangementer",
      title: "Tittel",
      location: "Sted",
      time: "Tidspunkt",
      comingArrangements: "Kommende arrangementer",
      earlierArrangements: "Tidligere arrangementer",
      myEvents: "Mine arrangementer",
      email: "Epost",
      password: "Passord",
      LoggedIn: "Du er innlogget",
      LoggedInAs: "Du er innlogget som {{email}} ",
      username: "Brukernavn",
      registerUser: "Registrer bruker", 
      selectType: "Velg arrangementstype",
      filterEvents: "Filtrer arrangementer",
      showAttendees: "Vis deltakere",
      sendInvitation: "Send invitasjon",
      attendees: "Deltakere",
      search: "Søk",
      searchPlaceholder: "Søk etter arrangementer...",  
      editEvent: "Endre arrangement",
      myInterests: "Mine interesser",
      recommendedForYou: "Anbefalt for deg",
      otherEvents: "Andre arrangementer",
      messages: "Meldinger",
      noMessages: "Ingen meldinger",
      discoverEventsNextToYou: "Oppdag arrangementer i nærheten",
      pleaseLogin: "Vennligst logg inn",
      readMore: "Les mer",
      showLess: "Vis mindre",
      writeEmail: "Skriv epost",
      participateInConversation: "Delta i samtalen",
      notifyAttendees: "Send varsling til deltakere",
      addComment: "Legg til kommentar",
      writeAComment: "Skriv en kommentar ...",
      writeAMessage: "Skriv en melding ...",
      sendNotificationHeader: "Send varsling til alle deltakerene på arrangementet",
      previouslySentNotifications: "Tidligere sendte varslinger:",
      noPreviousNotifications: "Ingen tidligere sendte varslinger",
      sureYouWannaSendNotification: "Er du sikker på at du vil sende denne varslingen?",
      abortSending: "Avbryt sending",
      // Feilmeldinger og statusmeldinger
    loginRequired: "Du må være innlogget for å melde deg på.",
    registrationError: "Feil ved påmelding.",
    registrationSuccess: "Du er nå påmeldt arrangementet!",
    deletionError: "Kunne ikke slette arrangement.",
    deletionSuccess: "Arrangement slettet!",
    unregistrationError: "Feil ved avmelding.",
    unregistrationSuccess: "Du er nå avmeldt arrangementet!",
    invitationAcceptError: "Feil ved aksept av invitasjon.",
    invitationDeclineError: "Feil ved avslag av invitasjon.",
    uploadImage: "Last opp bilde",
    category: "Kategori",
    selectCategory: "Velg arrangementskategori",
    resetFilters: "Fjern filtrering",
    eventCategories: {
      conference: "Konferanse",
      concert: "Konsert",
      sport: "Sport",
      festival: "Festival",
      webinar: "Webinar",
      party: "Fest",
      outdoor: "Utendørs",
      religion: "Religion",
      politics: "Politikk",
      creative: "Kreativt",
      karaoke: "Karaoke",
      educational: "Faglig",
      childfriendly: "Barnevennlig",
    },
    event: "Arrangement",
    message: "Melding",

    },
    en: {
      welcome: "Welcome",
      register: "Register",
      login: "Login",
      logout: "Logout",
      myCalendar: "My Calendar",
      addEvent: "Add event",
      myProfile: "My profile",
      loginToCreateEvent: "Login to create event",
      unregister: "Unregister",
      createEvent: "Create Event",
      delete: "Delete",
      save: "Save",
      saving: "Saving...",
      cancel: "Cancel",
      edit: "Edit",
      aboutMe: "About Me",
      noInfoAdded: "No information added.",
      writeSomethingAboutYourself: "Write something about yourself...",
      filterOfEvents: "Filter Events",
      all: "All",
      public: "Public",
      private: "Private",
      registered: "Registered",
      invitations: "Invitations",
      back: "Back",
      accept: "Accept",
      findYourEvents: "Find your next event",
      decline: "Decline",
      noEvents: "No events.",
      showLess: "Show less",  
      showMore: "Show more",
      close: "Close",
      success: "Success",
      error: "Error",
      join: "Join",
      description: "Description",
      place: "Place",
      type: "Type",
      no: "No",
      writeEmail: "Write email",
      date: "Date",
      when: "When",
      nobody: "Nobody",
      readMore: "Read more",
      unknown: "Unknown",
      notSpecified: "Not specified",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      arrangements: "Events",
      title: "Title",
      findYourNextEvent: "Find your next event",
      location: "Location",
      time: "Time",
      comingArrangements: "Upcoming Events",
      earlierArrangements: "Earlier Events",
      myEvents: "My Events",
      email: "Email",
      password: "Password",
      LoggedIn: "Du er innlogget",
      discoverEventsNextToYou: "Discover events next to you",
      LoggedInAs: "Du er innlogget som {{email}} ",
      username: "Username",
      registerUser: "Register user",
      selectType: "Select event type",
      filterEvents: "Filter Events",
      category: "Category",
      showAttendees: "Show attendees",
      sendInvitation: "Send invitation",
      attendees: "Attendees",
      search: "Search",
      searchPlaceholder: "Search events...",
    selectCategory: "Select event category",
    resetFilters: "Reset Filters",
    editEvent: "Edit event",
    myInterests: "My Interests",
    recommendedForYou: "Recommended for you",
    otherEvents: "Other",
    messages: "Messages",
    noMessages: "No messages",
    pleaseLogin: "Please log in",
    participateInConversation: "Participate in conversation",
    addComment: "Add comment",
    notifyAttendees: "Send notification to attendees",
    writeAComment: "Write a comment ...",
    writeAMessage: "Write a message ...",
    sendNotificationHeader: "Send a notication to all attendees of this event",
    previouslySentNotifications: "Previous notifications:",
    noPreviousNotifications: "No previous notifications",
    sureYouWannaSendNotification: "Are you sure you wanna send this notification?",
    abortSending: "Abort",
      // Feilmeldinger og statusmeldinger
    loginRequired: "You must be logged in to register.",
    registrationError: "Error during registration.",
    registrationSuccess: "You are now registered for the event!",
    deletionError: "Could not delete event.",
    deletionSuccess: "Event deleted!",
    unregistrationError: "Error during unregistration.",
    unregistrationSuccess: "You are now unregistered from the event!",
    invitationAcceptError: "Error accepting invitation.",
    invitationDeclineError: "Error declining invitation.",
    uploadImage: "Upload image",
    eventCategories: {
      conference: "Conference",
      concert: "Concert",
      sport: "Sport",
      festival: "Festival",
      webinar: "Webinar",
      party: "Party",
      outdoor: "Outdoor",
      religion: "Religion",
      politics: "Politics",
      creative: "Creative",
      karaoke: "Karaoke",
      educational: "Educational",
      childfriendly: "Family friendly",
    },
    event: "Event",
    message: "Message",

    },
  };
  
  export type Language = keyof typeof translations;
  export default translations;

  export const getEventCategories = (language: Language): string[] => {
    return Object.values(translations[language].eventCategories);
  };