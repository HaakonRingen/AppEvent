"use client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../app/firebase";
import useAuth from "../hooks/useAuth";
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from "../context/LanguageContext"; // Importer useLanguage
import { useState } from "react";
import translations, {Language} from "../translations";

const Navbar = () => {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { language, setLanguage } = useLanguage(); // Bruk useLanguage
  const [showLanguageOptions, setShowLanguageOptions] = useState(false); // Tilstand for å vise språkvalg

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLanguageOptions(false); // Skjul språkvalg etter valg
    console.log(`Språk endret til ${lang}`);
  };

  const t = translations[language]; // Hent riktig språk fra translations

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push("/")}>AppEvent</h1>
      <div className="space-x-4">
        {!isLoggedIn() && (
          <button onClick={() => router.push("/register")} className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
            {t.register}
          </button>
        )}
        {isLoggedIn() ? (
          <>
            <button onClick={() => router.push("/events")} className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
              {t.addEvent}
            </button>
            <button onClick={() => router.push("/calendar")} className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
              {t.myCalendar}
            </button>
            <button onClick={() => router.push("/profil")} className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
              {t.myProfile}
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
              {t.logout}
            </button>
          </>
        ) : (
          <>
            <button onClick={() => router.push("/login")} className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
              {t.loginToCreateEvent}
            </button>
            <button onClick={() => router.push("/login")} className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded">
              {t.login}
            </button>
          </>
        )}
        {/* Legg til språkknappen */}
        <div className="relative inline-block text-left">
          <button className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded flex items-center relative"
            style={{ bottom: '-0.4rem' }}
            onClick={() => setShowLanguageOptions(!showLanguageOptions)}>
            <LanguageIcon  />
          </button>
          {showLanguageOptions && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
            <button onClick={() => handleLanguageChange('no')} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
              Norsk
            </button>
            <button onClick={() => handleLanguageChange('en')} className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
              English
            </button>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;