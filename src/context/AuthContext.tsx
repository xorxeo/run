import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import firebaseApp from '../firebase/initFirebase';

const auth = firebaseApp.auth;

export const AuthContext = createContext({} as User | null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={user}>
      {loading ? <div>Loading...AuthContextProvider</div> : children}
    </AuthContext.Provider>
  );
};
