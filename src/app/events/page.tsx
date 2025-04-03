"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@/src/components/TextField";
import EventButton from "@/src/components/EventButton";
import DateField from "@/src/components/DateField";
import Alert from "@/src/components/AlertProp";
import useAuth from "../../hooks/useAuth";
import BackButton from "../../components/BackButton";
import { useLanguage } from "../../context/LanguageContext";
import translations, { getEventCategories, Language} from "../../translations";

const currentDateTime = new Date().toISOString().slice(0, 16);  // ISO-format tilpasset datetime-local

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [when, setWhen] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success"); // Ny tilstand for alert-type
  const [isPrivate, setIsPrivate] = useState(false);
  const [invitedEmails, setInvitedEmails] = useState("");
  const [image, setImage] = useState<File | null>(null); 
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const eventCategories = getEventCategories(language);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!loading && !isLoggedIn()) {
      router.push("/login");
    }
  }, [isLoggedIn, loading, router]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validerer obligatoriske felt
    if (!title || !description || !location || !when || !category) {
      setMessage("Vennligst fyll ut alle felter");
      setAlertType("error");
      setShowAlert(true);
      return;
    }
  
    const eventData = {
      title,
      description,
      type: isPrivate ? "private" : "public",
      category,
      location,
      when,
      owner: user?.uid,
      isPrivate,
      invitedUsers: isPrivate ? invitedEmails.split(",").map(email => email.trim()) : [],     
    };
  
    try {
      const formData = new FormData();
      formData.append("eventData", JSON.stringify(eventData));
      if (image) {
        formData.append("image", image);
      }
  
      const response = await fetch("/api/createEvent", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Event opprettet!");
        setAlertType("success");
        setShowAlert(true);
        resetForm();

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage(data.error || "Kunne ikke opprette event.");
        setAlertType("error");
        setShowAlert(true);
      }
    } catch (error) {
      setMessage("Feil ved tilkobling til serveren.");
      setAlertType("error");
      setShowAlert(true);
    }
  };

 

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("");
    setLocation("");
    setWhen("");
    setIsPrivate(false);
    setInvitedEmails("");
    setImage(null);
    setCategory("");
  };



  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md">
      <BackButton />
      <h2 className="text-2xl font-bold mb-6 text-center">{t.createEvent}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative inline-block w-full">
          <TextField 
            placeholder={t.title} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            name="title" 
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
            *
          </span>
        </div>
        <div className="relative inline-block w-full">
          <TextField 
            placeholder={t.description} 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            name="description" 
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
            *
          </span>
        </div>
        <div className="relative inline-block w-full">
          <TextField 
            placeholder={t.location} 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            name="location" 
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
            *
          </span>
        </div>
        <DateField placeholder={t.time} value={when} minDate={currentDateTime} onChange={(e) => setWhen(e.target.value)} />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full p-2 border rounded"
          style={{ color: category ? 'black' : 'gray' }}
        >
          <option value="" disabled hidden style={{ color: 'gray' }}>{t.selectCategory}</option>
          {eventCategories.map((catKey: string, index: number) => (
            <option key={index} value={catKey} style={{ color: 'black' }}>
              {catKey}
            </option>
          ))}
        </select>


        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="radio" name="privacy" checked={!isPrivate} onChange={() => setIsPrivate(false)} />
            <span>{t.public}</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" name="privacy" checked={isPrivate} onChange={() => setIsPrivate(true)} />
            <span>{t.private}</span>
          </label>
        </div>

        {isPrivate && (
          <TextField 
            placeholder="Inviterte e-postadresser (kommaseparert)"
            value={invitedEmails}
            onChange={(e) => setInvitedEmails(e.target.value)} 
            name={""}          
          />
        )}

        <div>
          <label className="block mb-2">{t.uploadImage}</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        </div>

        <EventButton onClick={handleSubmit} label={t.createEvent} />
        </form>
      {showAlert && (
        <Alert message={message} onClose={() => setShowAlert(false)} type={alertType} />
      )}
    </div>
  );
};

export default CreateEvent;