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
    console.log('user', user);
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
    <div>
      
      {isAdmin && user ? (
        <div className="admin-container flex w-full h-[90vh]">
          Hello, {user.email}
        </div>
      ) : (
        <h1>Only logged in users can view this page</h1>
      )}
    </div>
  );
}
