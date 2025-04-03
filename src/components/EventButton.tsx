'use client'
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import translations from "../translations";

interface EventButtonProps {
    onClick: (e: React.FormEvent) => void;
    label: string; // Dynamisk tekst basert på hvilken side vi er på
}

const EventButton: React.FC<EventButtonProps> = ({ onClick, label }) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
        >
            {label}
        </button>
    );
};

export default EventButton;
