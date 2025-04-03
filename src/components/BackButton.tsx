"use client";

import { useRouter } from "next/navigation";
import React from "react";
import translations from "../translations";
import { useLanguage } from "../context/LanguageContext";

interface BackButtonProps {
  text?: string; 
  to?: string; 
}

const BackButton: React.FC<BackButtonProps> = ({ text, to = "/" }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  const buttonText = text || t.back;

  return (
    <button
      onClick={() => router.push(to)}
      className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mb-4 mt-4"
    >
      ← {buttonText}
    </button>
  );
};

export default BackButton;
