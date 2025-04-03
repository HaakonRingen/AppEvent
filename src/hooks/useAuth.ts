"use client";

import { useEffect, useState } from "react";
import { auth } from "../config/firebase-config";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

interface FirestoreUserData {
  username?: string;
  aboutMe?: string;
  interests?: string[];
  location?: string;
  registeredEvents?: string[];
  invitedEvents?: string[]; 
  isAdmin?: boolean; 
}

interface CustomUser {
  uid: string;
  firebaseUser: FirebaseUser;
  firestoreData: FirestoreUserData;
}

const useAuth = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        const firestoreData = userSnap.exists()
        ? { invitedEvents: [], ...userSnap.data() } as FirestoreUserData
        : { invitedEvents: [] };
      
        setUser({ uid: firebaseUser.uid, firebaseUser, firestoreData });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db]);

  const isLoggedIn = () => Boolean(user?.firebaseUser);

  return { user, setUser, loading, isLoggedIn };
};

export default useAuth;
