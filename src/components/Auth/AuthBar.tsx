'use client';

import { useAuthContext } from '@/context/AuthContext';
import firebaseApp from '@/firebase/initFirebase';
import { User, getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const AuthBar = () => {
  const auth = firebaseApp.auth;
  const [isAdmin, setIsAdmin] = useState(false);

  const user = useAuthContext();

  useEffect(() => {
    if (user && user.email == process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL) {
      setIsAdmin(true);
    }
  }, [user]);

  const handlerSignOut = async () => {
    await signOut(auth).then(() => {
      setIsAdmin(false);
    });
  };

  const handleCheckUser = () => {
    console.log('user', user?.email, 'isAdmin', isAdmin);
  };

  return (
    <div className="flex justify-between gap-10 items-center font-semibold">
      {isAdmin && <Link href="/admin">admin page</Link>}

      <button onClick={handleCheckUser}>check user</button>

      {user && (
        <Link href="/" onClick={handlerSignOut}>
          sign out
        </Link>
      )}

      {user === null && (
        <Link href="/signIn" className="">
          sign in
        </Link>
      )}
    </div>
  );
};
