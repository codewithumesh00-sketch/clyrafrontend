import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ STRICT ENV CHECK (prevents silent bugs)
function getEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}

// ✅ CLEAN + CONSISTENT CONFIG (NO FALLBACKS)
const firebaseConfig = {
  apiKey: getEnv("NEXT_PUBLIC_FIREBASE_API_KEY", process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: getEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: getEnv("NEXT_PUBLIC_FIREBASE_APP_ID", process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// ✅ PREVENT MULTIPLE INIT (important for Next.js)
export const app =
  !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ AUTH INSTANCE
export const auth = getAuth(app);

// ✅ GOOGLE PROVIDER
export const googleProvider = new GoogleAuthProvider();

// ✅ OPTIONAL (recommended for better UX)
googleProvider.setCustomParameters({
  prompt: "select_account",
});