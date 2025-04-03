

"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TextField from "@/src/components/TextField";
import EventButton from "@/src/components/EventButton";
import DateField from "@/src/components/DateField";
import Alert from "@/src/components/AlertProp";
import useAuth from "../../../hooks/useAuth";
import { useLanguage } from "../../../context/LanguageContext";
import translations from "../../../translations";
import { getEventCategories } from "@/src/eventCategories";

const currentDateTime = new Date().toISOString().slice(0, 16);

const EditEvent = () => {
  const params = useParams();

  console.log("useParams() output:", params);

  const eventId = params?.eventId as string; // Sikrer at eventId er en string
  const router = useRouter();

  console.log("Event ID:", eventId); // Debugging

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    location: "",
    when: "",
    isPrivate: false,
    invitedUsers: [] as string[],
    imageUrl: "",
  });


  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const eventCategories = getEventCategories(language);
  
  const [category, setCategory] = useState("");
  

  // Sjekk om brukeren er logget inn
  useEffect(() => {
    if (!authLoading && !isLoggedIn()) {
      router.push("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  // Henter arrangementets eksisterende data
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      console.log("Henter event-data for ID:", eventId); // Debugging

      try {
        const res = await fetch(`/api/getSpecificEvent?eventId=${eventId}`);
        const data = await res.json();

        console.log("Mottatt event-data:", data); // Debugging
        
        if (res.ok) {
          setEventData(prevState => ({
            ...prevState,
            title: data.title || "",
            description: data.description || "",
            type: data.type || "",
            category: data.category || "",
            location: data.location || "",
            when: data.when ? new Date(data.when).toISOString().slice(0, 16) : "",
            isPrivate: data.isPrivate || false,
            invitedUsers: data.invitedUsers || [],
            imageUrl: data.imageUrl || "",
          }));
        } else {
          setMessage("Kunne ikke laste inn arrangement.");
          setAlertType("error");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Feil ved henting av arrangement:", error);
        setMessage("Feil ved henting av arrangement.");
        setAlertType("error");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData(prevState => ({
      ...prevState,
      when: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  //når du trykker på edit
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
  
    try {
      const token = await user?.firebaseUser?.getIdToken(); // Hent token for autentisering
  
      const formData = new FormData();
      formData.append("eventData", JSON.stringify(eventData));
      if (image) {
        formData.append("image", image);
      }
  
      const response = await fetch(`/api/updateEvent?eventId=${eventId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Legger til autentisering
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Arrangementet ble oppdatert!");
        setAlertType("success");
        setShowAlert(true); // Vis alert til brukeren
      } else {
        setMessage(data.error || "Kunne ikke oppdatere arrangement.");
        setAlertType("error");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Feil ved lagring:", error);
      setMessage("Feil ved tilkobling til serveren.");
      setAlertType("error");
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  };
  
  // 🚀 Når brukeren lukker alerten, send dem til profilsiden
  const handleCloseAlert = () => {
    setShowAlert(false);
    router.push("/profil");
  };
  
  

  if (loading) return <p>Laster...</p>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Rediger arrangement</h2>
      <form onSubmit={handleSave} className="space-y-6">
        <TextField placeholder={t.title} name="title" value={eventData.title} onChange={handleChange} />
        <TextField placeholder={t.description} name="description" value={eventData.description} onChange={handleChange} />
        <TextField placeholder={t.location} name="location" value={eventData.location} onChange={handleChange} />
        <DateField placeholder={t.time} value={eventData.when} minDate={currentDateTime} onChange={handleChange} />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full p-2 border rounded"
          style={{ color: category ? 'black' : 'black' }}
        >
          <option value="" style={{ color: 'black' }}>{eventData.category}</option>
          {eventCategories.map((catKey: string, index: number) => (
            <option key={index} value={catKey} style={{ color: 'black' }}>
              {catKey}
            </option>
          ))}
        </select>

        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="privacy" checked={!eventData.isPrivate} onChange={() => setEventData(prev => ({ ...prev, isPrivate: false }))} />
            <span>{t.public}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="privacy" checked={eventData.isPrivate} onChange={() => setEventData(prev => ({ ...prev, isPrivate: true }))} />
            <span>{t.private}</span>
          </label>
        </div>

        {eventData.isPrivate && (
          <TextField
            placeholder="Inviterte e-postadresser (kommaseparert)"
            name="invitedUsers"
            value={eventData.invitedUsers.join(", ")}
            onChange={(e) => setEventData(prev => ({ ...prev, invitedUsers: e.target.value.split(",").map(email => email.trim()) }))}
          />
        )}

        <div>
          <label className="block mb-2">{t.uploadImage}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {eventData.imageUrl && !image && (
          <div className="mb-4">
            <p>Nåværende bilde:</p>
            <img src={eventData.imageUrl} alt="Event-bilde" className="w-full max-w-xs rounded-md" />
          </div>
        )}

        <EventButton onClick={handleSave} label={saving ? "Lagrer..." : "Oppdater arrangement"} />
      </form>

      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Alert message={message} onClose={handleCloseAlert} type={alertType} />
          </div>
        </div>
      )}  
    </div>
  );
};

export default EditEvent;
