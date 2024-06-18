'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { EventsList } from '@/components/eventsList';
import { Sidebar } from '@/components/Sidebar';
import Script from 'next/script';

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
    <>
      {/* <Script
        id="maps"
        src={`https://api-maps.yandex.ru/v3/?apikey=${process.env.NEXT_PUBLIC_YMAP_APIKEY}&lang=ru_RU`}
     
      /> */}
      <div className="admin-children-container">
        {isAdmin && user ? (
          <h1>Hello, {user.email}</h1>
        ) : (
          <h1>Only logged in users can view this page</h1>
        )}
      </div>
    </>
  );
}
