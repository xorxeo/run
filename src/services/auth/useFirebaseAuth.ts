import { FirebaseContext } from '@/containers/FirebaseContainer';
import { useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export type authUserContextType = {
  authUser: User | null;
  admin: boolean | null;
  loading: boolean;
  signInEmailAndPassword: (email: string, password: string) => Promise<void>;
  createUserEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<void>;
  signOff: () => Promise<void>;
  checkAdmin: () => void;
};

export function useFirebaseAuth() {
  const currentAuthValueFromFirebaseContext = useContext(FirebaseContext);

  const currentAuth = currentAuthValueFromFirebaseContext.currentAuth;

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  const authStateChanged = async (userState: User | null) => {
    if (!userState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setAuthUser(userState);
    checkAdmin();
    setLoading(false);

  };

  useEffect(() => {
    const unsubscribe = currentAuth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, [currentAuth, authUser]);

  const clear = () => {
    setAuthUser(null);
    setAdmin(false);
    setLoading(true);
  };

  const signInEmailAndPassword = async (email: string, password: string) => {
    await signInWithEmailAndPassword(currentAuth, email, password);
  };

  const createUserEmailAndPassword = async (
    email: string,
    password: string
  ) => {
    await createUserWithEmailAndPassword(currentAuth, email, password);
  };

  const signOff = async () => {
    await signOut(currentAuth).then(clear);
  };

  const checkAdmin = () => {
    if (
      currentAuth.currentUser?.email &&
      currentAuth.currentUser?.email ===
        process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
    ) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
    return admin;
  };

  return {
    authUser,
    admin,
    loading,
    signInEmailAndPassword,
    createUserEmailAndPassword,
    signOff,
    checkAdmin,
  };
}
