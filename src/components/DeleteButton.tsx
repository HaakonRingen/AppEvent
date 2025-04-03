import React from "react";
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

interface DeleteButtonProps {
  eventId: string;
  onDelete: (eventId: string) => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ eventId, onDelete }) => {
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <button
      onClick={() => onDelete(eventId)}
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
    >
      {t.delete}
    </button>
  );
};

export default DeleteButton;