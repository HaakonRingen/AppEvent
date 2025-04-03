'use client';
import React from "react";

interface AlertProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "info";  // Ny prop for å styre alert-type
}

const Alert: React.FC<AlertProps> = ({ message, onClose, type = "success" }) => {
  // Definerer stiler basert på typen alert
  const alertStyles = 
  type === "success"
  ? "bg-green-100 border-green-400 text-green-700"
  : type === "info"
  ? "bg-blue-100 border-blue-400 text-blue-700"
  : "bg-red-100 border-red-400 text-red-700";
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent bakgrunn som dekker hele skjermen */}
      <div className="fixed inset-0 bg-black opacity-50"></div>

      {/* Modal-boksen med dynamiske stiler */}
      <div className={`border px-6 py-4 rounded-lg shadow-lg relative z-10 max-w-sm w-full ${alertStyles}`}>
        <strong className="text-lg font-bold block mb-2">{message}</strong>

        {/* Lukkeknapp */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;
