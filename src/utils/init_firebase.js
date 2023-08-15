import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "sparkdeals-a9107.firebaseapp.com",
  projectId: "sparkdeals-a9107",
  storageBucket: "sparkdeals-a9107.appspot.com",
  messagingSenderId: "697702771938",
  appId: "1:697702771938:web:054736840b4fcb19af42bb",
  measurementId: "G-RJ866G4KDV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
