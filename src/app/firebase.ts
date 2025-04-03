import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzmBPK7cgBrv4B_RZeivXf5RQ_yGUwCHY",
    authDomain: "appevent-6ac50.firebaseapp.com",
    databaseURL: "https://appevent-6ac50-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "appevent-6ac50",
    storageBucket: "appevent-6ac50.firebasestorage.app",
    messagingSenderId: "524024511111",
    appId: "1:524024511111:web:df4f7b54270764ca0b5622",
    measurementId: "G-GL6WVZHDL8"
  };
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const db = getFirestore(app);