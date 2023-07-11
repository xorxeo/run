import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import { Auth, getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import FirebaseService from "./firebaseService";


// export type FirebaseEntity = {
//   app: FirebaseApp;
//   db: Firestore;
//   currentAuth: Auth;
// }

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   dataBaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS_MEASUREMENT_ID,
// };

// let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const firebaseApp = new FirebaseService();

export default firebaseApp;




