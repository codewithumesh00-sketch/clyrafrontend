import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// NOTE:
// - We try env-config first (for deployments).
// - If env is missing, we fall back to the repo's previously hard-coded config
//   so local dev continues to work without extra setup.
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyABt5vdsk6Wsuj96robB4bYmCn5AWIylyQ",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "clyraui.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "clyraui",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "clyraui.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "489677679886",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:489677679886:web:f37c0cd00a391e178afb5f",
};

// Prevent multiple initialization (common during hot reload/dev).
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();