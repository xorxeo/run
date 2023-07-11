import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import firebaseApp from '../initFirebase';
import { FirebaseError } from 'firebase/app';

const auth = firebaseApp.auth;

export default async function signUpWithEmailAndPassword(
  email: string,
  password: string
) {
   await createUserWithEmailAndPassword(auth, email, password);
 
}
