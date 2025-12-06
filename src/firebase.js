// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Realtime Database
// import { getFirestore } from "firebase/firestore"; // Agar Firestore use karna ho future mein

const firebaseConfig = {
  apiKey: "AIzaSyDRRIDJHFx0e7YplIhYYIiK48gDWWXxoBY",
  authDomain: "acadix-digitals.firebaseapp.com",
  projectId: "acadix-digitals",
  storageBucket: "acadix-digitals.firebasestorage.app",
  messagingSenderId: "926272876490",
  appId: "1:926272876490:web:b6667ea578151d0ba1e933",
  measurementId: "G-ZE5Y0TJHLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
const auth = getAuth(app);
const db = getDatabase(app, "https://acadix-digitals-default-rtdb.firebaseio.com/");
 // Realtime Database instance

export { app, auth, db };
