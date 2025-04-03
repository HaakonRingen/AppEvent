import React from "react";
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

interface RegisterButtonProps {
  eventId: string;
  onRegister: (eventId: string) => void;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ eventId, onRegister }) => {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <button
      onClick={() => onRegister(eventId)}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex-grow"
    >
     {t.join}
    </button>
  );
};

export default RegisterButton;