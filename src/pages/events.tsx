import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import Link from 'next/link';

import {
  collection,
  query,
  where,
  getDocs,
  Query,
  DocumentData,
} from 'firebase/firestore';

import { initFirebase } from '../firebase/initFirebase';
import { EventFormValues } from '@/modules/EventForm/event-form.schema';

const Events: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { db } = initFirebase();

  const [events, setEvents] = useState<EventFormValues[]>([]);

  const fetchEvents = async () => {
    if (db) {
      const queryEvents = query(
        collection(db, 'events')
        // where('name', '==', 'test')
      );
      const querySnapshot = await getDocs(queryEvents);
      console.log('querySnapshot', querySnapshot.docs[0])
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, ' => ', doc.data());
        // setEvents((events) => [...events, querySnapshot]);
      // });
    } else {
      console.log('no Database')
    }
  };

  // useEffect(() => {
  //   if (db) {
  //     fetchEvents();
  //   }
  // }, [db]);

  return (
    <div className="events-container h-screen bg-slate-300 text-slate-900 text-3xl">
      Event
      <Link href={'/events'}>{children}</Link>
    </div>
  );
};

export default Events;
