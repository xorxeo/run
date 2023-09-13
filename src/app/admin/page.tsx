'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { EventsList } from '@/components/eventsList';
import { Sidebar } from '@/components/Sidebar';

// import { useAuth } from "@/containers/AuthUserContainer";

export default function Admin() {
  const user = useAuthContext();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.email == process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL) {
      setIsAdmin(true);
    }
    if (
      user === null ||
      user.email !== process.env.NEXT_PUBLIC_FIREBASE_ADMIN_EMAIL
    ) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="admin-container flex m-auto justify-center ">
      {isAdmin && user ? (
        <h1>Hello, {user.email}</h1>
      ) : (
        <h1>Only logged in users can view this page</h1>
      )}
    </div>
  );
}
