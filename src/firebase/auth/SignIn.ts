import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "../initFirebase";
import { FirebaseError } from "firebase/app";

const auth = firebaseApp.auth;

export default async function signInEmailAndPassword(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
  
}