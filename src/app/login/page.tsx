"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import TextField from "@/src/components/TextField"; 
import Alert from "@/src/components/AlertProp"; 
import BackButton from "../../components/BackButton";
import translations from "@/src/translations";
import { useLanguage } from "@/src/context/LanguageContext";

const LoggInn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | undefined>(undefined); // Initialize as undefined
  const [alertVisible, setAlertVisible] = useState(false); 
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage(`Innlogget som ${userCredential.user.email}`);
      setMessageType("success"); 
      setAlertVisible(true); 
    } catch (error) {
      setMessage("Feil brukernavn eller passord");
      setMessageType("error");
      setAlertVisible(true); 
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage("Du har logget ut");
      setMessageType("success"); 
      setUser(null);
      setAlertVisible(true); // Show the alert
    } catch (error) {
      setMessage("Noe gikk galt ved utlogging");
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
      <h2 className="text-lg font-bold mb-4 text-black">{user ? "Du er innlogget" : t.login}</h2>

      {message && alertVisible && (
        <Alert message={message} onClose={handleAlertClose} type={messageType} />
      )}

      {user ? (
        <div className="text-center">
          <p className="text-black mb-2">Innlogget som {user.email}</p>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded-md w-full">
            {t.logout}
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField 
            type="email" 
            placeholder= {t.email} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <TextField 
            type="password" 
            placeholder={t.password}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-md w-full">
            {t.login}
          </button>
        </form>
      )}
    </div>
  );
};

export default LoggInn;
