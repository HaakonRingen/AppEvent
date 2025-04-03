"use client";

import React from "react";
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

interface UnregisterButtonProps {
  eventId: string;
  onUnregister: (eventId: string) => void; 
}

const UnregisterButton: React.FC<UnregisterButtonProps> = ({ eventId, onUnregister }) => {

  const { language } = useLanguage();
  const t = translations[language];
  return (
    <button
      onClick={() => onUnregister(eventId)} 
      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 flex-grow"
    >
      {t.unregister}
    </button>
  );
};

export default UnregisterButton;
