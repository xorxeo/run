import { FirebaseApp, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


export type FirebaseEntity = {
  app: FirebaseApp;
  db: Firestore;
  currentAuth: Auth;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  dataBaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_MEASUREMENT_ID,
};

export function initFirebase(): Partial<FirebaseEntity> {
  let app: FirebaseApp | undefined;
  let db: Firestore | undefined;
  let currentAuth: Auth | undefined;

  if (typeof window !== "undefined") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    currentAuth = getAuth();
    
    // const analytics = getAnalytics(app);
  }
  // console.log(currentAuth);
 
  return { app, db, currentAuth };
}

