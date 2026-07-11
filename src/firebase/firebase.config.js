import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevOnly_DoNotUseInProd",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "the-jewel-store.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "the-jewel-store",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "the-jewel-store.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);

export default app;
