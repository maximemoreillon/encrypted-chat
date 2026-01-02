import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClfsmmyMopiMlV880SIE8VXF-o1RRKAXc",
  authDomain: "encrypted-chat-b8f59.firebaseapp.com",
  projectId: "encrypted-chat-b8f59",
  storageBucket: "encrypted-chat-b8f59.firebasestorage.app",
  messagingSenderId: "230182915714",
  appId: "1:230182915714:web:fc1bb684d6facff1092e9b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const googleProvider = new GoogleAuthProvider();
