import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABt5vdsk6Wsuj96robB4bYmCn5AWIylyQ",
  authDomain: "clyraui.firebaseapp.com",
  projectId: "clyraui",
  storageBucket: "clyraui.firebasestorage.app",
  messagingSenderId: "489677679886",
  appId: "1:489677679886:web:f37c0cd00a391e178afb5f"
};

// ✅ Prevent multiple initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();