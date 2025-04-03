// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzmBPK7cgBrv4B_RZeivXf5RQ_yGUwCHY",
  authDomain: "appevent-6ac50.firebaseapp.com",
  projectId: "appevent-6ac50",
  storageBucket: "appevent-6ac50.firebasestorage.app",
  messagingSenderId: "524024511111",
  appId: "1:524024511111:web:df4f7b54270764ca0b5622",
  measurementId: "G-GL6WVZHDL8"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

export {app, auth};
// const analytics = getAnalytics(app);