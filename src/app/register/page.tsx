"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import TextField from "@/src/components/TextField"; 
import Alert from "@/src/components/AlertProp"; 
import BackButton from "../../components/BackButton";
import translations from "@/src/translations";
import { useLanguage } from "@/src/context/LanguageContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); 
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await signInWithEmailAndPassword(auth, email, password);

        setMessage("Bruker opprettet og innlogget!");
        setMessageType("success");
        setAlertVisible(true);
      } else {
        throw new Error(data.error || "Feil ved registrering");
      }
    } catch (error: any) {
      setMessage(error.message || "Noe gikk galt");
      setMessageType("error");
      setAlertVisible(true);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    router.push("/");
  };

  return (
    <div className="p-4 border rounded-md shadow-md max-w-md mx-auto bg-white">
      <BackButton />
      <h2 className="text-lg font-bold mb-4 text-black">{t.registerUser}</h2>

      {message && alertVisible && (
        <Alert message={message} onClose={handleAlertClose} type={messageType} />
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <TextField 
          placeholder={t.username}
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <TextField 
          type="email" 
          placeholder={t.email}
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <TextField 
          type="password" 
          placeholder={t.password}
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded-md w-full"
        >
          {t.register}
        </button>
      </form>
    </div>
  );
};

export default Register;
